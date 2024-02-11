import React from "react";

function Header() {
  return (
    <div className="flex justify-between items-center w-full p-6 text-black [font-family:'Maven_Pro-Bold',Helvetica] drop-shadow">
      <div>Header</div>
      <div className="flex justify-between items-center space-x-4">
        {/* Placeholder 1 */}
        <div className="bg-gray-200 p-2 rounded">Placeholder 1</div>
        {/* Placeholder 2 */}
        <div className="bg-gray-200 p-2 rounded">Placeholder 2</div>
        {/* Placeholder 3 */}
        <div className="bg-gray-200 p-2 rounded">Placeholder 3</div>
        {/* Placeholder 4 */}
        <div className="bg-gray-200 p-2 rounded">Placeholder 4</div>
      </div>
    </div>
  );
}

export default Header;
