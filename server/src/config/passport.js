import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github';
import User from '../models/User.js';

/**
 * Shared verify logic for all OAuth strategies (spec D2):
 * 1. Find user by provider id → login
 * 2. Else find by email → LINK provider id to existing account (no duplicates)
 * 3. Else create new user (provider pre-verifies email → isVerified: true)
 */
const oauthVerify = (provider) => async (req, accessToken, refreshToken, profile, done) => {
  try {
    const providerIdField = `${provider}Id`;
    const providerId = profile.id;
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const avatar = profile.photos?.[0]?.value;

    // 1) Existing user via provider id
    let user = await User.findOne({ [providerIdField]: providerId });
    if (user) return done(null, user);

    // 2) Existing user via email → link account
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        user[providerIdField] = providerId;
        if (avatar && !user.avatar?.url) user.avatar = { url: avatar };
        await user.save();
        return done(null, user);
      }
    }

    // 3) Brand new user — provider already verified the email
    user = await User.create({
      name: profile.displayName || email?.split('@')[0] || 'Member',
      email,
      authProvider: provider,
      [providerIdField]: providerId,
      isVerified: true, // OAuth providers verify emails for us
      avatar: avatar ? { url: avatar } : undefined,
    });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) =>
        oauthVerify('google')(req, accessToken, refreshToken, profile, done)
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email'],
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) =>
        oauthVerify('github')(req, accessToken, refreshToken, profile, done)
    )
  );
};
