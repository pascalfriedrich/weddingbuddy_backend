export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  digitalOcean: {
    spaces: {
      key: process.env.DO_SPACES_KEY,
      secret: process.env.DO_SPACES_SECRET,
      bucket: process.env.DO_SPACES_BUCKET,
    },
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
