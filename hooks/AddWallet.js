import axios from 'axios';
import Api from '../Api';

const AddWallet = async (userId, price, setUser) => {
  try {
    const res = await axios.post(`${Api}/Wallet/AddWallet/${userId}`, {
      Price: price,
    });
    if (res.status === 200) {
      setUser(prev => ({
        ...prev,
        Wallet: {
          ...prev.Wallet,
          TotalWallet: res.data,
        },
      }));
      return 'ok';
    }
  } catch (error) {
    console.error('Failed to add wallet:', error);
  }
};

export default AddWallet;
