import { useOrgBookmarks } from "../hooks/useOrgBookmarks";

export interface OrgBookmarkListProps {
  /** All available org IDs that can be bookmarked */
  orgs: string[];
}

/**
 * Displays a list of bookmarkable organizations.
 * Bookmarks are persisted to localStorage and restored on page load.
 */
export function OrgBookmarkList({ orgs }: OrgBookmarkListProps) {
  const { bookmarks, add, remove } = useOrgBookmarks();

  return (
    <section aria-label="Organization bookmarks">
      <h2 style={{ marginBottom: "0.75rem", fontSize: "1rem", fontWeight: 600 }}>
        Organizations
      </h2>

      {/* Available orgs — bookmark toggle */}
      <ul
        role="list"
        aria-label="Available organizations"
        style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        {orgs.map((org) => {
          const isBookmarked = bookmarks.includes(org);
          return (
            <li key={org} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{org}</span>
              <button
                type="button"
                onClick={() => (isBookmarked ? remove(org) : add(org))}
                aria-label={isBookmarked ? `Remove ${org} from bookmarks` : `Bookmark ${org}`}
                aria-pressed={isBookmarked}
                style={{
                  background: "none",
                  border: "1px solid currentColor",
                  borderRadius: "4px",
                  padding: "2px 8px",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  color: isBookmarked ? "#facc15" : "#94a3b8",
                }}
              >
                {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bookmarked orgs list */}
      <div aria-label="Bookmarked organizations">
        <h3 style={{ marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "#94a3b8" }}>
          Bookmarked ({bookmarks.length})
        </h3>
        {bookmarks.length === 0 ? (
          <p
            role="status"
            style={{ fontSize: "0.875rem", color: "#94a3b8", fontStyle: "italic" }}
          >
            No bookmarks yet. Click ☆ next to an org to save it.
          </p>
        ) : (
          <ul
            role="list"
            aria-label="Bookmarked organizations list"
            style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.375rem" }}
          >
            {bookmarks.map((org) => (
              <li
                key={org}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}
              >
                <span style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#facc15" }}>
                  ★ {org}
                </span>
                <button
                  type="button"
                  onClick={() => remove(org)}
                  aria-label={`Remove ${org} from bookmarks`}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    color: "#ef4444",
                    padding: "2px 6px",
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
