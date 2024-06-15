import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ socket }) => {
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContactsAndGroups = async () => {
      try {
        const token = localStorage.getItem('token');
        const contactsResponse = await axios.get('http://localhost:3002/contacts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const groupsResponse = await axios.get('http://localhost:3002/groups', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(contactsResponse.data.contacts);
        setGroups(groupsResponse.data.groups);
      } catch (error) {
        console.error('Error fetching contacts and groups:', error.message);
        setError('Error fetching contacts and groups');
      }
    };

    fetchContactsAndGroups();
  }, []);

  const handleCreateGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3002/groups', { name: groupName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups([...groups, response.data.group]);
      setGroupName('');
    } catch (error) {
      console.error('Error creating group:', error.message);
      setError('Error creating group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3002/groups/${groupId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // After successful join, fetch updated groups list
      const groupsResponse = await axios.get('http://localhost:3002/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(groupsResponse.data.groups);
    } catch (error) {
      console.error('Error joining group:', error.message);
      setError('Error joining group');
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(contactSearchQuery.toLowerCase())
  );

  // Filter groups based on search query
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  return (
    <div className="p-3 border-end bg-light">
      <h5>Contacts</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        type="text"
        className="form-control mb-2"
        value={contactSearchQuery}
        onChange={(e) => setContactSearchQuery(e.target.value)}
        placeholder="Search Contacts"
      />
      <ul className="list-group">
        {filteredContacts.map((contact) => (
          <li key={contact._id} className="list-group-item">
            {contact.username}
          </li>
        ))}
      </ul>
      <h5 className="mt-4">Groups</h5>
      <input
        type="text"
        className="form-control mb-2"
        value={groupSearchQuery}
        onChange={(e) => setGroupSearchQuery(e.target.value)}
        placeholder="Search Groups"
      />
      <ul className="list-group">
        {filteredGroups.map((group) => (
          <li key={group._id} className="list-group-item d-flex justify-content-between align-items-center">
            {group.name}
            <button className="btn btn-primary btn-sm" onClick={() => handleJoinGroup(group._id)}>Join</button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          className="form-control mb-2"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
        />
        <button className="btn btn-primary" onClick={handleCreateGroup}>Create Group</button>
      </div>
    </div>
  );
};

export default Sidebar;
