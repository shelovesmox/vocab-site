import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to the search results page
    navigate(`/search/${searchTerm}`);
    // Clear the search term after submitting
    setSearchTerm("");
  };

  return (
    <nav className="flex items-center ipad:gap-0 gap-5 justify-center ipad:justify-between p-4">
      <div className="ipad:flex items-center space-x-4 pl-5 hidden">
        <NavItem label="Home" />
        <NavItem label="Wordlist" />
        <NavItem label="Browse" />
      </div>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit}>
        <div className="bg-gray-300 font-bold rounded-lg px-4 py-2 w-[20rem] xl:w-[34rem]">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </form>
      </div>
      <div className="flex items-center">
        <div className="empty select-none hidden ipad:flex">ㅤㅤㅤㅤ</div>
        <div className="empty select-none hidden ipad:flex">ㅤㅤㅤㅤ</div>
        <div className="empty select-none hidden ipad:flex">ㅤㅤㅤㅤ</div>
        <div className="empty select-none hidden ipad:flex">ㅤ</div>
        <div className="hover:cursor-pointer hover:scale-110 transition duration-150 bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center">
          {/* Replace with your avatar image */}
          <img
            className="rounded-full w-full h-full object-cover"
            src="/path-to-avatar-image.jpg"
            alt="Avatar"
          />
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ label }) => {
  return (
    <div className="flex items-center space-x-1">
      <a href="/" className="font-bold hover:cursor-pointer hover:scale-110 transition duration-150">{label}</a>
    </div>
  );
};

export default Navbar;
