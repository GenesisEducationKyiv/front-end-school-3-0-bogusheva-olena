/// <reference types="vite/client" />
declare module "*.svg?react" {
    import * as React from "react";
    const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement>
    >;
    export default ReactComponent;
}

interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_WS_BASE_URL: string;
    readonly GENERATE_SOURCEMAP: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
