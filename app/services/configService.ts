export const configService = {
  getJwtSecret() {
    return String(process.env.JWT_SECRET);
  }
};
