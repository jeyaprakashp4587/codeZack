import axios from 'axios';
import Api from '../Api';
import {useData} from '../Context/Contexter';
import {useCallback} from 'react';

const AddWallet = useCallback(async price => {
  const {user, setUser} = useData();
  const res = await axios.post(`${Api}/Wallet/AddWallet/${user?._id}`, {
    Price: price,
  });
  if (res.status == 200) {
    setUser(res.data);
    return 'ok';
  }
}, []);

export default AddWallet;
