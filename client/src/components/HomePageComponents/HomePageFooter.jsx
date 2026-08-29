import linkedInLogo from "../../assets/linkedIn.svg";
import leetCodeLogo from "../../assets/leetCode.svg";
import instagramLogo from "../../assets/instagram.svg";
import githubLogo from "../../assets/github.svg";

function HomePageFooter() {
  return (
    <footer className="py-4 mt-8 w-full flex flex-col items-center justify-center gap-8">
      <p className="text-sm font-semibold text-center text-yellow-500 mt-3">
        Designed and Developed by Sujal Shrestha
      </p>
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="flex space-x-6">
          <a
            href={import.meta.env.VITE_REACT_APP_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <img src={linkedInLogo} alt="LinkedIn" className="h-8 lg:h-12" />
          </a>
          <a
            href={import.meta.env.VITE_REACT_APP_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <img src={githubLogo} alt="GitHub" className="h-8 lg:h-12" />
          </a>
          <a
            href={import.meta.env.VITE_REACT_APP_LEETCODE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <img src={leetCodeLogo} alt="LeetCode" className="h-8 lg:h-12" />
          </a>
          <a
            href={import.meta.env.VITE_REACT_APP_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <img src={instagramLogo} alt="Instagram" className="h-8 lg:h-12" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default HomePageFooter;
