import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { userService } from '@/services/api/userService';
import PostCard from '@/components/molecules/PostCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, [username]);

  async function loadUserProfile() {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load user data and posts in parallel
      const [userData, userPosts, userPostCount] = await Promise.all([
        userService.getByUsername(username),
        userService.getUserPosts(username),
        userService.getUserPostCount(username)
      ]);
      
      setUser(userData);
      setPosts(userPosts);
      setPostCount(userPostCount);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError(err.message);
      toast.error(`Failed to load profile for @${username}`);
    } finally {
      setLoading(false);
    }
  }

function handleBackClick() {
    navigate('/');
  }

function handleRetry() {
    loadUserProfile();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Error 
            message={error}
            onRetry={handleRetry}
          />
          <div className="mt-4 text-center">
            <Button onClick={handleBackClick} variant="outline">
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Feed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Empty 
            icon="User"
            message={`User @${username} not found`}
            description="This user profile doesn't exist or may have been removed."
          />
          <div className="mt-4">
            <Button onClick={handleBackClick} variant="outline">
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Feed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button 
            onClick={handleBackClick}
            variant="outline"
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Feed
          </Button>
          
          {/* User Profile Header */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <img 
                src={user.avatar} 
                alt={`${user.displayName}'s avatar`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-slate-900 truncate">
                  {user.displayName}
                </h1>
                <span className="text-lg text-slate-500">@{user.username}</span>
              </div>
              
              {user.bio && (
                <p className="text-slate-700 mb-3 leading-relaxed">
                  {user.bio}
                </p>
              )}
              
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <ApperIcon name="MapPin" size={14} />
                  {user.location || 'Location not set'}
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Calendar" size={14} />
                  Joined {formatDistanceToNow(new Date(user.joinedDate), { addSuffix: true })}
                </div>
                {user.website && (
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Globe" size={14} />
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">{postCount}</div>
                  <div className="text-sm text-slate-600">Posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Posts Section */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="MessageSquare" size={18} />
            Posts by @{user.username}
          </h2>
          
          {posts.length === 0 ? (
            <Empty 
              icon="MessageSquare"
              message="No posts yet"
              description={`@${user.username} hasn't shared any posts yet.`}
            />
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.Id}
                  post={post}
                  className="border border-slate-200 rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}