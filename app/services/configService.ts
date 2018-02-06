export const configService = {
  getJwtSecret() {
    return String(process.env.JWT_SECRET);
  },
  getRavenUrl() {
    return String(process.env.RAVEN_URL);
  }
};
