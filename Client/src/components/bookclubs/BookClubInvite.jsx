import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BookClubInvite = () => {
  const { id } = useParams();
  const [inviteMethod, setInviteMethod] = useState('email');
  const [emailInvites, setEmailInvites] = useState(['']);
  const [inviteMessage, setInviteMessage] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingInvites, setSendingInvites] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call to get book club info and generate shareable link
    setTimeout(() => {
      setShareableLink(`https://bookclub.app/invite/${id}/join?token=abc123`);
      setPendingInvites([
        {
          id: 1,
          email: 'john@example.com',
          sentDate: '2024-07-20',
          status: 'pending',
          expiresDate: '2024-07-27'
        },
        {
          id: 2,  
          email: 'jane@example.com',
          sentDate: '2024-07-19',
          status: 'accepted',
          joinedDate: '2024-07-20'
        },
        {
          id: 3,
          email: 'mike@example.com',
          sentDate: '2024-07-18',
          status: 'expired',
          expiresDate: '2024-07-25'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [id]);

  const addEmailField = () => {
    setEmailInvites([...emailInvites, '']);
  };

  const removeEmailField = (index) => {
    if (emailInvites.length > 1) {
      const newEmails = emailInvites.filter((_, i) => i !== index);
      setEmailInvites(newEmails);
    }
  };

  const updateEmail = (index, value) => {
    const newEmails = [...emailInvites];
    newEmails[index] = value;
    setEmailInvites(newEmails);
  };

  const handleSendInvites = async (e) => {
    e.preventDefault();
    setSendingInvites(true);
    
    // TODO: Implement actual API call
    const validEmails = emailInvites.filter(email => email.trim() !== '');
    
    // Simulate API call
    setTimeout(() => {
      const newInvites = validEmails.map((email, index) => ({
        id: pendingInvites.length + index + 1,
        email,
        sentDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
      
      setPendingInvites([...pendingInvites, ...newInvites]);
      setEmailInvites(['']);
      setInviteMessage('');
      setSendingInvites(false);
      
      // Show success message (you could add a toast notification here)
      alert(`Successfully sent ${validEmails.length} invite(s)!`);
    }, 2000);
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      // Show success message (you could add a toast notification here)
      alert('Shareable link copied to clipboard!');
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'declined':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'expired':
        return 'Expired';
      case 'declined':
        return 'Declined';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const resendInvite = (inviteId) => {
    // TODO: Implement resend functionality
    console.log('Resending invite:', inviteId);
    alert('Invite resent successfully!');
  };

  const cancelInvite = (inviteId) => {
    // TODO: Implement cancel functionality
    setPendingInvites(pendingInvites.filter(invite => invite.id !== inviteId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Invite Members</h1>
            <Link
              to={`/bookclubs/${id}/members`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Members
            </Link>
          </div>
          <p className="text-gray-600 mt-2">Invite new members to join your book club</p>
        </div>

        <div className="p-6">
          {/* Invite Method Tabs */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setInviteMethod('email')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                inviteMethod === 'email'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Email Invites
            </button>
            <button
              onClick={() => setInviteMethod('link')}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                inviteMethod === 'link'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shareable Link
            </button>
          </div>

          {/* Email Invites Tab */}
          {inviteMethod === 'email' && (
            <div>
              <form onSubmit={handleSendInvites} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Addresses
                  </label>
                  {emailInvites.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email address"
                      />
                      {emailInvites.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmailField(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEmailField}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add another email</span>
                  </button>
                </div>

                <div>
                  <label htmlFor="inviteMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    id="inviteMessage"
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a personal message to your invitation..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingInvites}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition duration-200 flex items-center space-x-2"
                >
                  {sendingInvites ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending Invites...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Send Invites</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Shareable Link Tab */}
          {inviteMethod === 'link' && (
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Shareable Invite Link</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Share this link with anyone you'd like to invite to your book club. The link will remain active until you disable it.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={copyShareableLink}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Security Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Anyone with this link can join your book club. Only share it with people you trust.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="bg-white rounded-lg shadow-md mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Pending Invites</h2>
            <p className="text-gray-600 mt-1">{pendingInvites.length} invite(s) sent</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{invite.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>Sent {formatDate(invite.sentDate)}</span>
                      {invite.status === 'pending' && (
                        <span>Expires {formatDate(invite.expiresDate)}</span>
                      )}
                      {invite.status === 'accepted' && (
                        <span>Joined {formatDate(invite.joinedDate)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invite.status)}`}
                    >
                      {getStatusLabel(invite.status)}
                    </span>
                    
                    {invite.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => resendInvite(invite.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Resend
                        </button>
                        <button
                          onClick={() => cancelInvite(invite.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookClubInvite;
