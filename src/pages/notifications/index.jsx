import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkAsSeenMutation,
} from "../../redux/notificationsApi";

const Notifications = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { data: notifications = [], isLoading } = useGetNotificationsQuery(
    currentUser?.uid
  );
  const [markAsSeen] = useMarkAsSeenMutation();

  if (isLoading) return <div>Loading...</div>;

  const handleMarkAsSeen = async (notifId) => {
    await markAsSeen({ userId: currentUser.uid, notificationId: notifId });
  };
  console.log(notifications);
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
            <p>
              {notif.type === "follow" && (
                <span>
                  <Link
                    to={`/profile/${notif.fromUserId}`}
                    className="font-bold flex justify-start items-center gap-1"
                  >
                    <img
                      src={
                        notif?.photoURL || "images/User-Profile-PNG-Clipart.png"
                      }
                      alt="profile"
                      className="size-8 rounded-full"
                    />
                    <p className=" text-nowrap">
                      {notif?.displayName || "User Name"}
                    </p>
                    {notif.fromUserId}
                  </Link>{" "}
                  followed you.
                </span>
              )}
              {notif.type === "like" && (
                <span className=" flex justify-start items-center gap-2 md:gap-4">
                  <Link
                    to={`/profile/${notif.fromUserId}`}
                    className="font-bold flex justify-start items-center gap-1"
                  >
                    <img
                      src={
                        notif?.photoURL || "images/User-Profile-PNG-Clipart.png"
                      }
                      alt="profile"
                      className="size-8 rounded-full"
                    />
                    <p className=" text-nowrap">
                      {notif?.displayName || "User Name"}
                    </p>
                  </Link>{" "}
                  liked your{" "}
                  <Link to={`/post/${notif.postId}`} className="text-blue-500">
                    post
                  </Link>
                  .
                </span>
              )}
              {notif.type === "comment" && (
                <span className=" flex justify-start items-center gap-2 md:gap-4">
                  <Link
                    to={`/profile/${notif.fromUserId}`}
                    className="font-bold flex justify-start items-center gap-1"
                  >
                    <img
                      src={
                        notif?.photoURL || "images/User-Profile-PNG-Clipart.png"
                      }
                      alt="profile"
                      className="size-8 rounded-full"
                    />
                    <p className="">
                      {notif?.displayName || "User Name"}
                    </p>{" "}
             
                  </Link>{" "}
                  commented on your{" "}
                  <Link to={`/post/${notif.postId}`} className="text-blue-500">
                    post
                  </Link>
                  .
                </span>
              )}
              {notif.type === "repost" && (
                <span className=" flex justify-start items-center gap-2 md:gap-4">
                  <Link
                    to={`/profile/${notif.fromUserId}`}
                    className="font-bold flex justify-start items-center gap-1"
                  >
                    <img
                      src={
                        notif?.photoURL || "images/User-Profile-PNG-Clipart.png"
                      }
                      alt="profile"
                      className="size-8 rounded-full"
                    />
                    <p className=" text-nowrap">
                      {notif?.displayName || "User Name"}
                    </p>
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
