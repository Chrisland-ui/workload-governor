import { useState } from "react";
import { NavBar } from "./components/NavBar";
import { OnboardingWizard, GetStartedButton } from "./components/OnboardingWizard";
import { MaintainerPanel } from "./components/MaintainerPanel";
import type { Application, Assignment } from "./components/MaintainerPanel";
import { ActivityFeed } from "./components/ActivityFeed";
import { IssueCard } from "./components/IssueCard";
import type { IssueStatus } from "./components/IssueCard";
import { ToastContainer, useToast } from "./components/Toast";
import "./app.css";

// Demo data — replace with real API calls
const DEMO_APPS: Application[] = [
  { id: "1", contributor: "GBXXX1ABCDEFGHIJKLMNO12345", org: "stellar-org", issueTitle: "Fix TTL extension bug", appliedDate: "2026-06-20" },
  { id: "2", contributor: "GCYYY2PQRSTUVWXYZABCDE67890", org: "stellar-org", issueTitle: "Add prop tests for assign_issue", appliedDate: "2026-06-21" },
  { id: "3", contributor: "GAZZZ3FGHIJKLMNOPQRST11111", org: "meridian-dao", issueTitle: "Docs: storage design overview", appliedDate: "2026-06-22" },
];

const DEMO_ASGNS: Assignment[] = [
  { id: "a1", contributor: "GBXXX1ABCDEFGHIJKLMNO12345", org: "stellar-org", issueTitle: "Optimize WASM binary size" },
  { id: "a2", contributor: "GDWWW4LMNOPQRSTUVWXYZ22222", org: "meridian-dao", issueTitle: "Integration tests for SDK" },
];

interface DemoIssue {
  id: string;
  org: string;
  title: string;
  status: IssueStatus;
}

const INITIAL_ISSUES: DemoIssue[] = [
  { id: "i1", org: "stellar-org",  title: "Fix TTL extension race condition", status: "open" },
  { id: "i2", org: "meridian-dao", title: "Add fuzzing target for batch_apply", status: "open" },
  { id: "i3", org: "stellar-org",  title: "Refactor storage key helpers",       status: "applied" },
];

export default function App() {
  const [applications, setApplications] = useState(DEMO_APPS);
  const [assignments, setAssignments] = useState(DEMO_ASGNS);
  const [issues, setIssues] = useState<DemoIssue[]>(INITIAL_ISSUES);
  const { toasts, add: addToast, remove: removeToast } = useToast();

  async function handleAssign(app: Application) {
    await new Promise((r) => setTimeout(r, 400)); // simulate network
    setApplications((prev) => prev.filter((a) => a.id !== app.id));
    setAssignments((prev) => [...prev, { id: app.id, contributor: app.contributor, org: app.org, issueTitle: app.issueTitle }]);
    addToast(`Assigned "${app.issueTitle}" to ${app.contributor.slice(0, 8)}…`, "success");
  }

  async function handleComplete(asgn: Assignment) {
    await new Promise((r) => setTimeout(r, 400));
    setAssignments((prev) => prev.filter((a) => a.id !== asgn.id));
    addToast(`Completed "${asgn.issueTitle}"`, "success");
  }

  async function handleRevoke(asgn: Assignment) {
    await new Promise((r) => setTimeout(r, 400));
    setAssignments((prev) => prev.filter((a) => a.id !== asgn.id));
    addToast(`Revoked "${asgn.issueTitle}"`, "info");
  }

  /** Optimistic apply — simulates a blockchain transaction (3-6 s).
   *  Randomly rejects ~30 % of the time to demonstrate revert + toast. */
  async function handleApply(id: string) {
    // Simulate blockchain latency
    await new Promise((r) => setTimeout(r, 3000 + Math.random() * 3000));
    // Simulate occasional tx rejection
    if (Math.random() < 0.3) {
      throw new Error("Transaction rejected by the network");
    }
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: "applied" as IssueStatus } : issue
      )
    );
  }

  function handleApplyError(id: string, error: unknown) {
    const msg = error instanceof Error ? error.message : "Transaction failed";
    const issue = issues.find((i) => i.id === id);
    const label = issue ? `"${issue.title}"` : `issue ${id}`;
    addToast(`Failed to apply for ${label}: ${msg}`, "error");
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <NavBar />

      <header className="app-header" role="banner">
        <span className="app-logo" aria-hidden="true">⚙</span>
        <h1>WorkloadGovernor</h1>
        <GetStartedButton />
      </header>

      <main id="main-content" className="app-main" tabIndex={-1}>
        {/* Open issues — optimistic apply */}
        <section aria-label="Open issues" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Open Issues</h2>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                id={issue.id}
                org={issue.org}
                title={issue.title}
                status={issue.status}
                onApply={handleApply}
                onApplyError={handleApplyError}
              />
            ))}
          </div>
        </section>

        <MaintainerPanel
          applications={applications}
          assignments={assignments}
          onAssign={handleAssign}
          onComplete={handleComplete}
          onRevoke={handleRevoke}
        />
        <ActivityFeed apiBase="/api" network="testnet" />
      </main>

      <OnboardingWizard />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
