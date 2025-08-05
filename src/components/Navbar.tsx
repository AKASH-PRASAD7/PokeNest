import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <header className="text-white bg-purple-950 shadow-sm sticky top-0 z-50 ">
        <div className="max-w-6xl mx-auto ">
          <div className="flex items-center gap-6 h-16">
            <NavLink to="/" className="flex items-center space-x-1">
              <div className="text-2xl">⚡</div>
              <h1 className="text-xl font-bold text-gray-100">PokéNest</h1>
            </NavLink>

            {/* Navigation Links */}

            <nav className="flex space-x-1">
              <NavLink
                to="/collection"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                    isActive
                      ? " text-white"
                      : "text-gray-200 hover:text-gray-100 "
                  }`
                }
              >
                <div className="text-2xl">📚</div>
                <h1 className="text-xl font-bold text-gray-100">
                  Collections{" "}
                </h1>
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
