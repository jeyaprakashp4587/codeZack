import {createContext, useContext, useState} from 'react';

const Contexter = createContext();
export const ContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTechnology, setselectedTechnology] = useState(null);
  const [selectedChallengeTopic, setselectedChallengeTopic] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPost, setselectedPost] = useState(null);
  const [assignmentType, setAssignmentType] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedProject, setSelectedProject] = useState([]);

  return (
    <Contexter.Provider
      value={{
        selectedPost,
        setselectedPost,
        selectedCourse,
        setSelectedCourse,
        selectedTechnology,
        setselectedTechnology,
        selectedChallengeTopic,
        setselectedChallengeTopic,
        selectedChallenge,
        setSelectedChallenge,
        user,
        setUser,
        selectedUser,
        setSelectedUser,
        assignmentType,
        setAssignmentType,
        selectedCompany,
        setSelectedCompany,
        selectedProject,
        setSelectedProject,
      }}>
      {children}
    </Contexter.Provider>
  );
};
export const useData = () => {
  return useContext(Contexter);
};
