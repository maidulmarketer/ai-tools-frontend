import Brand from "./Brand";
import Container from "../wrappers/Container";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";

export default function UserNavbar() {
  return (
    <nav className="fixed top-0 w-full bg-dtheme border-b-2 border-odtheme/10 z-10">
      <Container className="p-4 md:pb-4 flex justify-between items-center relative">
        <Brand sponsor="Stocking AI" />
        <div className="flex gap-4 items-center">
          <div className="hidden md:block">
            <NavLinks />
          </div>
          <NavActions />
        </div>
      </Container>
    </nav>
  );
}
