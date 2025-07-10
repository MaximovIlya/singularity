export const getStoredAccount = (): string | null => {
  return localStorage.getItem('walletAccount');
};

export const setStoredAccount = (account: string | null): void => {
  if (account) {
    localStorage.setItem('walletAccount', account);
  } else {
    localStorage.removeItem('walletAccount');
  }
};
