import {fetchData} from './fetch';

const getUserData = async () => {
  console.log('Käyttäjän DATA Kubioksesta');

  const url = 'http://localhost:3000/api/kubios/user-data';
  const token = localStorage.getItem('token');
  const headers = {Authorization: `Bearer ${token}`};
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }
  console.log(userData);
  // userDatan on oltava array
  return userData;
};

export {getUserData};
