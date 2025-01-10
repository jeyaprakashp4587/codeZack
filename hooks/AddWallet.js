import axios from 'axios';
import {functionApi} from '../Api';

const AddWallet = async (userId, price, setUser) => {
  try {
    const {status, data} = await axios.post(
      `${functionApi}/Wallet/AddWallet/${userId}`,
      {
        Price: price,
      },
    );
    if (status === 200) {
      setUser(prev => ({...prev, Wallet: data.Wallet}));
      return 'ok';
    }
  } catch (error) {
    console.error('Failed to add wallet:', error);
  }
};

export default AddWallet;
