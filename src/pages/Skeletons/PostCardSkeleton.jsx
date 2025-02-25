const PostCardSkeleton = () => {
  return (
    <div className="bg-white p-2 mt-2 shadow-md rounded-lg animate-pulse">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-gray-300"></div>
          <div className="flex flex-col">
            <div className="w-24 h-4 bg-gray-300 rounded"></div>
            <div className="w-16 h-3 bg-gray-300 rounded mt-1"></div>
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>
      {/* Post Content */}
      <div className="mt-3">
        <div className="w-full h-4 bg-gray-300 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-300 rounded mt-2"></div>
      </div>
      {/* Image Placeholder */}
      <div className="w-full h-40 bg-gray-300 rounded-lg mt-4"></div>
      {/* Post Actions */}
      <div className="w-full border-t mt-3 p-2 text-gray-500 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="w-10 h-4 bg-gray-300 rounded"></div>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="w-10 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
