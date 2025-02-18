
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetNotificationsQuery, useMarkAsSeenMutation } from "../../redux/notificationsApi";

const Notifications = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { data: notifications, isLoading } = useGetNotificationsQuery(
    currentUser?.uid
  );
  const [markAsSeen] = useMarkAsSeenMutation();

  if (isLoading) return <div>Loading...</div>;

  const handleMarkAsSeen = async (notifId) => {
    await markAsSeen({ userId: currentUser.uid, notificationId: notifId });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-96">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      {notifications?.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        notifications?.map((notif) => (
          <div
            key={notif.id}
            className={`p-2 border-b ${
              notif.seen ? "bg-gray-100" : "bg-blue-100"
            }`}
          >
            <p>
              {notif.type === "follow" && (
                <span>
                  <Link
                    to={`/profile/${notif.fromUserId}`}
                    className="font-bold"
                  >
                    {notif.fromUserId}
                  </Link>{" "}
                  followed you.
                </span>
              )}
              {notif.type === "like" && (
                <span>
                  <Link
                    to={`/profile/${notif.fromUserId}`}
                    className="font-bold"
                  >
                    {notif.fromUserId}
                  </Link>{" "}
                  liked your{" "}
                  <Link to={`/post/${notif.postId}`} className="text-blue-500">
                    post
                  </Link>
                  .
                </span>
              )}
              {notif.type === "comment" && (
                <span>
                  <Link
                    to={`/profile/${notif.fromUserId}`}
                    className="font-bold"
                  >
                    {notif.fromUserId}
                  </Link>{" "}
                  commented on your{" "}
                  <Link to={`/post/${notif.postId}`} className="text-blue-500">
                    post
                  </Link>
                  .
                </span>
              )}
              {notif.type === "repost" && (
                <span>
                  <Link
                    to={`/profile/${notif.fromUserId}`}
                    className="font-bold"
                  >
                    {notif.fromUserId}
                  </Link>{" "}
                  reposted your{" "}
                  <Link to={`/post/${notif.postId}`} className="text-blue-500">
                    post
                  </Link>
                  .
                </span>
              )}
            </p>
            {!notif.seen && (
              <button
                onClick={() => handleMarkAsSeen(notif.id)}
                className="text-sm text-gray-600"
              >
                Mark as read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
