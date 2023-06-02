import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Decor from "../images/TextDecor.svg";
import LoginGraphic from "../images/LoginGraphic.svg";
import Vector from "../images/Vector.svg";
// NavItem Component
interface NavItemProps {
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ label }) => {
  return (
    <div className="flex items-center space-x-1">
      <a
        href="/"
        className="font-bold hover:cursor-pointer hover:scale-110 transition duration-150"
      >
        {label}
      </a>
    </div>
  );
};

// Navbar Component
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [modalType, setModalType] = useState<"login" | "register">("login");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleVisibility = (type: "login" | "register") => {
    setIsOpen(true);
    setModalType(type);
    setAnimationClass("animate__animated animate__slideInDown");
  };

  const slideUp = () => {
    setAnimationClass("animate__animated animate__slideOutUp");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
    setSearchTerm("");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:8080/auth/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Login successful!");
        navigate("/"); 
      } else if (response.status == 404) {
        setErrorMessage("Invalid Credentials");

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);

      } else if (response.status == 429) {
        
        setErrorMessage("Slow down, Too Many Requests");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else if (response.status == 401) {
        setErrorMessage("Invalid Password");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`flex h-screen fixed inset-0 z-50 bg-black opacity-100 ${animationClass}`}
        >
          <div className="flex-1 flex flex-col justify-center bg-[#6085f3]">
            <div className="header flex flex-col items-center text-white font-black text-4xl text-center">
              Expand Your Vocabulary and Boost Your Communication Skills.
              <img
                className="justify-self-start w-full h-[33rem] pr-16"
                src={LoginGraphic}
                alt=""
              />
            </div>
          </div>
          {modalType === "login" && (
            <div className="flex-1 flex flex-col bg-white">
              <div className="close-btn justify-end w-full items-center flex">
                <IoMdClose
                  size={40}
                  onMouseOver={(e: any) =>
                    ((e.target as HTMLElement).style.cursor = "pointer")
                  }
                  onClick={slideUp}
                />
              </div>
              <div className="register-login-switch flex-col pt-12 pl-5 flex">
                <div className="switches flex gap-3">
                  <div className="register hover:scale-110 transition duration-75 hover:cursor-pointer gap-1 flex flex-col items-center font-black text-xl">
                    Register
                  </div>
                  <div className="login hover:scale-110 transition duration-75 hover:cursor-pointer items-center gap-1 flex flex-col font-black text-xl">
                    Login
                    <img
                      className="justify-self-start w-[10rem]"
                      src={Decor}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className="register-form flex flex-col items-center justify-center w-full h-screen">
                <form onSubmit={handleFormSubmit} className="w-full max-w-md">
                  <div className="flex items-center justify-center w-full">
                    {errorMessage && (
                      <p className="text-red-500 mb-2 rounded-sm  bg-transparent w-72 text-center font-medium">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col mb-4 font-bold">
                    <label className="mb-2" htmlFor="email">
                      Email:
                    </label>
                    <input
                      className="border-2 border-[#6085f3] rounded-sm px-3 py-2"
                      type="email"
                      id="email"
                      placeholder="vocabrocks123@vocab.com"
                      name="email"
                      required
                    />
                  </div>
                  <div className="flex flex-col mb-4 font-bold">
                    <label className="mb-2" htmlFor="password">
                      Password:
                    </label>
                    <input
                      className="border-2 border-[#6085f3] rounded-sm px-3 py-2"
                      type="password"
                      id="password"
                      placeholder="vocabrocks123"
                      name="password"
                      required
                    />
                  </div>
                  <div>
                    <button
                      className="bg-[#6085f3] hover:bg-[#547CF3] hover:bg-blue- text-white w-full font-bold py-2 px-4 rounded"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex flex-1 w-full h-96 justify-end items-end">
                <img className="" src={Vector} alt="" />
              </div>
            </div>
          )}
          {modalType === "register" && (
            <div className="flex-1 flex flex-col bg-white">
              <div className="close-btn justify-end w-full items-center flex">
                <IoMdClose
                  size={40}
                  onMouseOver={(e: any) =>
                    ((e.target as HTMLElement).style.cursor = "pointer")
                  }
                  onClick={slideUp}
                />
              </div>
              <div className="register-login-switch flex-col pt-12 pl-5 flex">
                <div className="switches flex gap-5">
                  <div className="register hover:scale-110 transition duration-75 hover:cursor-pointer gap-1 flex flex-col items-center justify-start font-black text-xl">
                    Register
                    <img
                      className="justify-self-start w-[10rem]"
                      src={Decor}
                      alt=""
                    />
                  </div>
                  <div className="login hover:scale-110 transition duration-75 hover:cursor-pointer text-xl font-black">
                    Login
                  </div>
                </div>
              </div>
              <div className="register-form flex flex-col items-center justify-center w-full h-screen">
                <form className="w-full max-w-md">
                  <div className="flex flex-col font-bold mb-4">
                    <label className="mb-2 font-bold" htmlFor="username">
                      Username:
                    </label>
                    <input
                      className="border-2 border-[#6085f3] rounded-sm px-3 py-2"
                      type="text"
                      id="username"
                      placeholder="NinjaVocab"
                      name="username"
                      required
                    />
                  </div>
                  <div className="flex flex-col mb-4 font-bold">
                    <label className="mb-2" htmlFor="email">
                      Email:
                    </label>
                    <input
                      className="border-2 border-[#6085f3] rounded-sm px-3 py-2"
                      type="email"
                      id="email"
                      placeholder="vocabrocks123@vocab.com"
                      name="email"
                      required
                    />
                  </div>
                  <div className="flex flex-col mb-4 font-bold">
                    <label className="mb-2" htmlFor="password">
                      Password:
                    </label>
                    <input
                      className="border-2 border-[#6085f3] rounded-sm px-3 py-2"
                      type="password"
                      id="password"
                      placeholder="vocabrocks123"
                      name="password"
                      required
                    />
                  </div>
                  <div className="flex flex-col mb-6 font-bold">
                    <label className="mb-2" htmlFor="confirmPassword">
                      Confirm Password:
                    </label>
                    <input
                      className="border-2 border-[#6085f3] rounded-sm px-3 py-2"
                      type="password"
                      placeholder="vocabrocks123"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                    />
                  </div>
                  <div>
                    <button
                      className="bg-[#6085f3] hover:bg-[#547CF3] hover:bg-blue- text-white w-full font-bold py-2 px-4 rounded"
                      type="submit"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex flex-1 w-full h-96 justify-end items-end">
                <img className="" src={Vector} alt="" />
              </div>
            </div>
          )}
        </div>
      )}
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
        <div className="flex items-center gap-6">
          <div className="empty select-none hidden ipad:flex">ㅤ</div>
          <a
            onClick={() => toggleVisibility("login")}
            className="hidden ipad:flex hover:scale-110 font-semibold hover:cursor-pointer"
          >
            Login
          </a>
          <a
            onClick={() => toggleVisibility("register")}
            className="hidden hover:scale-110 transiton duration-75 ipad:flex font-semibold hover:cursor-pointer"
          >
            Register
          </a>
          <div className="hover:cursor-pointer hover:scale-110 transition duration-150 bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center">
            <img
              className="rounded-full w-full h-full object-cover"
              src="/path-to-avatar-image.jpg"
              alt="Avatar"
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
