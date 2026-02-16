import type React from "react";

import { Card, CardContent } from "@cortexapps/react-plugin-ui";

import EntityDetails from "./EntityDetails";

import "../baseStyles.css";

export const AppTabs: React.FC = () => {
  return (
    <div className="flex flex-col p-1">
      <Card>
        <CardContent className="pt-4">
          <EntityDetails />
        </CardContent>
      </Card>
    </div>
  );
};

export default AppTabs;
