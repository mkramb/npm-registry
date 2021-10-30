export const getServerUrl = () => {
  return process.env.SERVER_API ?? 'http://localhost:4000';
};
