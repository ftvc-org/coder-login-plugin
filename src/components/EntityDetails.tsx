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
      <Heading>
        <CardTitle>Coder</CardTitle>
      </Heading>
      <div className="mt-3">
        {(() => {
          const repoName = entity?.info?.["x-cortex-git"]?.github?.repository || "";
          const coderUrl = repoName ? `https://coder.gbs-platform-eng-nonprod.aws.fisv.cloud/templates/FTS/open/workspace?mode=auto&name=${repoName}&param.git_repo=https://github.com/ftvc-org/${repoName}.git&param.cluster=us-west-2&param.image=workspace-full&param.cpu=1&param.memory=2&param.home_disk_size=10&param.dotfiles_uri=&param.user_npm_token=&param.vscode_web_enabled=false&param.jetbrains_gateway_enabled=false&param.vscode_desktop_enabled=true` : "";
          return (
            <Button
              variant="secondary"
              onClick={() => coderUrl && window.open(coderUrl, "_blank")}
              disabled={!repoName}
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
