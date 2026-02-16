import type React from "react";

import { CardTitle, Loader, Button } from "@cortexapps/react-plugin-ui";

import { usePluginContextProvider } from "./PluginContextProvider";
import useEntityDescriptor from "../hooks/useEntityDescriptor";
import useEntityCustomData from "../hooks/useEntityCustomData";
import useEntityCustomEvents from "../hooks/useEntityCustomEvents";

import { Heading, Section, Subsection } from "./UtilityComponents";
import JsonView from "./JsonView";

const EntityDetails: React.FC = () => {
  const context = usePluginContextProvider();
  const entityTag = context?.entity?.tag ?? "";
  const { entity, isLoading: isEntityLoading } = useEntityDescriptor({
    entityTag,
  });
  const { customData, isLoading: isCustomDataLoading } = useEntityCustomData({
    entityTag,
  });
  const { customEvents, isLoading: isCustomEventsLoading } =
    useEntityCustomEvents({ entityTag });

  const isLoading =
    isEntityLoading || isCustomDataLoading || isCustomEventsLoading;

  if (isLoading) {
    return <Loader size="large" />;
  }

  if (!entityTag) {
    return (
      <Section>
        <Heading>Entity Details</Heading>
        <Subsection>No entity selected.</Subsection>
      </Section>
    );
  }

  return (
    <Section>
      {/* <Heading>
        <CardTitle>Coder</CardTitle>
      </Heading> */}
      <div className="mt-3">
        {(() => {
          // Support both GitHub and GitLab repositories
          const githubRepo = entity?.info?.["x-cortex-git"]?.github?.repository || "";
          const gitlabRepo = entity?.info?.["x-cortex-git"]?.gitlab?.repository || "";
          const fullRepoName = githubRepo || gitlabRepo || "";
          
          // Determine if it's GitHub or GitLab based on which repo is populated
          const isGitHub = !!githubRepo;
          const isGitLab = !!gitlabRepo;
          
          // Extract repository name from "owner/repo" or "org/group/repo" format
          const repoNamePart = fullRepoName.split('/').pop() || "";
          
          // Sanitize repoName: remove/replace special characters, limit to 32 chars
          let repoName = repoNamePart
            .toLowerCase()
            .replace(/[_]+/g, "-") // Replace underscores with hyphens
            .replace(/[^a-z0-9-]/g, "") // Remove all non-alphanumeric characters except hyphens
            .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
            .substring(0, 32); // Limit to 32 characters
          
          // Get repoUrl from x-cortex-link array (supports both GitHub and GitLab)
          const cortexLinks = entity?.info?.["x-cortex-link"] || [];
          console.log("x-cortex-link array:", cortexLinks);
          
          let repoUrl = cortexLinks.find(
            (link: any) => link.url?.includes("github.com") || link.url?.includes("gitlab.com")
          )?.url || "";
          
          // If repoUrl is not found in x-cortex-link, build it from x-cortex-git
          if (!repoUrl && fullRepoName) {
            if (isGitHub) {
              repoUrl = `https://github.com/${fullRepoName}`;
            } else if (isGitLab) {
              repoUrl = `https://gitlab.com/${fullRepoName}`;
            }
          }
          
          // Remove .git suffix if it already exists
          if (repoUrl.endsWith(".git")) {
            repoUrl = repoUrl.slice(0, -4);
          }

          // Debug logging
          console.log("fullRepoName:", fullRepoName);
          console.log("repoNamePart:", repoNamePart);
          console.log("repoName (sanitized):", repoName);
          console.log("isGitHub:", isGitHub);
          console.log("isGitLab:", isGitLab);
          console.log("repoUrl:", repoUrl);
          
          const coderUrl = repoName && repoUrl ? `https://coder.gbs-platform-eng-nonprod.aws.fisv.cloud/templates/FTS/open/workspace?mode=auto&name=${repoName}&param.git_repo=${repoUrl}.git&param.cluster=us-west-2&param.image=workspace-full&param.cpu=1&param.memory=2&param.home_disk_size=10&param.dotfiles_uri=&param.user_npm_token=&param.vscode_web_enabled=false&param.jetbrains_gateway_enabled=false&param.vscode_desktop_enabled=true` : "";
          
          console.log("Button disabled:", !repoName || !repoUrl);
          console.log("coderUrl:", coderUrl);
          
          return (
            <Button
              variant="secondary"
              onClick={() => coderUrl && window.open(coderUrl, "_blank")}
              disabled={!repoName || !repoUrl}
            >
              Open Workspace
            </Button>
          );
        })()}
      </div>


    </Section>
  );
};

export default EntityDetails;
