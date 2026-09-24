interface Props {
  size?: number;
  glow?: boolean;
}

export function JyotiAvatar({ size = 36, glow = false }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        overflow: "hidden",
        boxShadow: glow ? "var(--glow-avatar)" : "none",
        transition: "box-shadow 0.3s ease",
        background: "var(--surface-soft)",
      }}
    >
      <img
        src="/jyoti-logo.jpg"
        alt="Rasmalai"
        width={size}
        height={size}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
