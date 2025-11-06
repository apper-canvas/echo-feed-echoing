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
  const [followerStats, setFollowerStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
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
      // Load user data, posts, and following stats in parallel
      const [userData, userPosts, userPostCount, stats] = await Promise.all([
        userService.getByUsername(username),
        userService.getUserPosts(username),
        userService.getUserPostCount(username),
        userService.getFollowerStats(username)
      ]);
      
      // Handle case where user doesn't exist
      if (!userData) {
        setUser(null);
        setPosts([]);
        setPostCount(0);
        setError(`User @${username} not found`);
        toast.error(`User @${username} doesn't exist`);
        return;
      }
      
setUser(userData);
      setPosts(userPosts || []);
      setPostCount(userPostCount || 0);
      setFollowerStats(stats || { followers: 0, following: 0 });
      
      // Check if current user is following this profile (assuming currentUser is 'johndoe')
      const currentUser = 'johndoe'; // In real app, this would come from auth context
      if (currentUser !== username) {
        const following = await userService.isFollowing(currentUser, username);
        setIsFollowing(following);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError(err.message || 'Failed to load user profile');
      toast.error(`Failed to load profile for @${username}`);
    } finally {
      setLoading(false);
    }
  }

async function handleFollowToggle() {
    const currentUser = 'johndoe'; // In real app, this would come from auth context
    
    if (currentUser === username) {
      toast.error("You cannot follow yourself");
      return;
    }
    
    setFollowLoading(true);
    
    try {
      if (isFollowing) {
        await userService.unfollow(currentUser, username);
        setIsFollowing(false);
        setFollowerStats(prev => ({ ...prev, followers: prev.followers - 1 }));
        toast.success(`Unfollowed @${username}`);
      } else {
        await userService.follow(currentUser, username);
        setIsFollowing(true);
        setFollowerStats(prev => ({ ...prev, followers: prev.followers + 1 }));
        toast.success(`Now following @${username}`);
      }
    } catch (err) {
      console.error('Follow action failed:', err);
      toast.error(err.message || 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
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
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">{followerStats.followers}</div>
                  <div className="text-sm text-slate-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">{followerStats.following}</div>
                  <div className="text-sm text-slate-600">Following</div>
                </div>
              </div>
              
              {/* Follow Button - only show if not viewing own profile */}
              {username !== 'johndoe' && (
                <div className="mt-4">
                  <Button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    variant={isFollowing ? "outline" : "default"}
                    className={`min-w-[120px] ${
                      isFollowing 
                        ? 'text-slate-700 border-slate-300 hover:bg-slate-50' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {followLoading ? (
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Loader2" size={16} className="animate-spin" />
                        <span>{isFollowing ? 'Unfollowing...' : 'Following...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ApperIcon 
                          name={isFollowing ? "UserMinus" : "UserPlus"} 
                          size={16} 
                        />
                        <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                      </div>
                    )}
                  </Button>
                </div>
              )}
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