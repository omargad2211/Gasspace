import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkAsSeenMutation,
} from "../../redux/notificationsApi";

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { data: notifications = [], isLoading } = useGetNotificationsQuery(
    currentUser?.uid
  );
  const [markAsSeen] = useMarkAsSeenMutation();

  if (isLoading) return <div>Loading...</div>;

  const handleMarkAsSeen = async (notifId) => {
    await markAsSeen({ userId: currentUser.uid, notificationId: notifId });
  };

  const handleVisitPost = (postId, notifId) => {
    navigate(`/post/${postId}`);
    handleMarkAsSeen(notifId);
  };

  return (
    <div className="min-h-screen bg-primary px-4 mx-auto pt-24 pl-[100px] ss:pl-[150px] md:px-[20%]">
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
            {notif.type === "follow" && (
              <div
                onClick={() => handleMarkAsSeen(notif.id)}
                className="flex items-center gap-2"
              >
                <Link
                  to={`/profile/${notif.fromUserId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-bold flex justify-start items-center gap-1"
                >
                  <img
                    src={
                      notif?.photoURL || "images/User-Profile-PNG-Clipart.png"
                    }
                    alt="profile"
                    className="size-8 rounded-full"
                  />
                  <p className="text-nowrap">
                    {notif?.displayName || "User Name"}
                  </p>
                </Link>
                <span>followed you.</span>
              </div>
            )}

            {["like", "comment", "repost"].includes(notif.type) && (
              <button
                onClick={() => handleVisitPost(notif.postId, notif.id)}
                className="flex justify-start items-center gap-2 md:gap-4 w-full text-left text-[9px] xs:text-[13px] md:text-lg"
              >
                <Link
                  to={`/profile/${notif.fromUserId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-bold flex justify-start items-center gap-1"
                >
                  <img
                    src={
                      notif?.photoURL || "images/User-Profile-PNG-Clipart.png"
                    }
                    alt="profile"
                    className="size-8 rounded-full"
                  />
                  <p className="text-nowrap">
                    {notif?.displayName || "User Name"}
                  </p>
                </Link>
                {notif.type === "like" && <span>liked your post</span>}
                {notif.type === "comment" && (
                  <span>commented on your post</span>
                )}
                {notif.type === "repost" && <span>reposted your post.</span>}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
