import { BACKEND_URL } from "../config";

export const premiumApi = {
  getPremiumData: async () => {
    const res = await fetch(`${BACKEND_URL}/premium`);
    return res.json();
  },

  getSecretBoost: async (userId: string) => {
    const res = await fetch(`${BACKEND_URL}/premium/boost?userId=${userId}`);
    return res.json();
  }
};
