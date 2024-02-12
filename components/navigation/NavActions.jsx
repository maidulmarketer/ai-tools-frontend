import ThemeSwitcher from "../theme/ThemeSwitcher";
import GoogleAuthButton from "./GoogleAuthButton";
import MobileNav from "./MobileNav";
import Subscribe from "./Subscribe";

export default function NavActions() {
  return (
    <div className="flex gap-2 md:gap-4 items-center">
      {/* <Subscribe /> */}
      <div className="hidden md:block">
        <ThemeSwitcher />
      </div>

      <GoogleAuthButton />

      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
