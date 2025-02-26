import React from "react";
import ItemsContainer from "./ItemContainer";
import SocialIcons from "./SocialIcons";
import { Icons } from "./Menu";

const Footer = () => {
  return (
    <footer className="bg-black  text-white w-screen">
      <ItemsContainer />
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
      text-center pt-2 text-gray-400 text-sm pb-8"
      >
        <span>© 2025 Appy. All rights reserved.</span>
        <span> Made with ❤️ by MD Afsar </span>
        <SocialIcons Icons={Icons} />
      </div>
    </footer>
  );
};

export default Footer;