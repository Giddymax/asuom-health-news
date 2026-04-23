import type { CSSProperties, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Container({ children, className, style }: ContainerProps) {
  return (
    <div className={["container", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
