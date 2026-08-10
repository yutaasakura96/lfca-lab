# Git Concepts

Git Concepts is one of the three competencies in DevOps Fundamentals, alongside DevOps Basics
and Containers, in a domain worth 12% of the exam — the 5th largest of 6 domains under the current (2025-09-16) blueprint, with only IT
Project Management Fundamentals smaller at 10% — and the competency was unchanged by the 2025
update. LFS200 touches a minority of it: of its 22 concepts, 5 are FULLY COVERED and 17 are NOT
COVERED, so 5/22 (23%) are covered at all, in a single lesson
(`research/lfs200-notes/00-course-map.md`); the remaining 17, including the whole
fetch/pull/push axis and every undo operation, are sourced independently below against
git-scm.com. The exam has no practical component, so nothing here is tested by making you type
a command — it is tested by making you choose between two commands that sound equally
plausible, which is why every topic below is written around the boundary rather than the
definition.

<a id="s-git-concepts-fundamentals"></a>
## Fundamentals

<a id="c-devops.git-concepts.version-control"></a>
### Version control
*id: `devops.git-concepts.version-control` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: progit-what-is-git*

**What it is** The practice, and the tooling that implements it, of recording changes to a set
of files over time so that any earlier state can be recovered and every change is attributable
to an author with a timestamp and a stated reason. Git is one implementation of version
control, not a synonym for it — Subversion, Mercurial and Perforce are others.

**Why it matters** This competency's two most examinable confusions are both about what version
control is *not*. It is not a backup, and it is not change management. All three record
something about "what changed," which is exactly why a question can present all three as
plausible answers to one scenario.

**How it works** The unit of recording is a deliberate, human-initiated snapshot: someone
decides a state is worth keeping and records it with a message. The system stores each snapshot
with its author, timestamp and the snapshot it followed, so the history is a chain that can be
walked backwards, diffed pairwise, and blamed line by line. Recovery is therefore selective —
you restore one file to one prior revision, not the whole machine to one prior moment.

**Key terms** revision; history; attribution; audit trail.

**Traps** A repository is not a backup, even when it is hosted on a server. Backup is about
surviving loss of data or a system, is scheduled rather than author-initiated, covers files
nobody edits, and is measured in RPO and RTO; version control is about the evolution and
authorship of files someone is actively changing, and it records only what a person chose to
commit. Change management is different again: it is the organisational process of proposing,
approving and recording changes to a production environment, and it governs people and
approvals, not file contents. A version control system can supply evidence for change
management, but it does not perform it.

**What the exam may test** Given a described need — "recover the state of this configuration
file as of last Tuesday," "restore a server after a disk failure," "get an approval recorded
before this change goes to production" — assign it to version control, backup, or change
management respectively, rather than to whichever term appears in the question stem.

*Not to be confused with [change management](../02-system-administration/best-practices.md#cmp-sysadmin.best-practices.change-management).*
*Not to be confused with [backup](../02-system-administration/disaster-recovery.md#cmp-sysadmin.disaster-recovery.backup).*

<a id="c-devops.git-concepts.distributed-vs-centralized-version-control"></a>
### Distributed vs centralized version control
*id: `devops.git-concepts.distributed-vs-centralized-version-control` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: progit-what-is-git*

**What it is** Two architectures for the same job. In a distributed system — Git, Mercurial —
every clone holds the entire history, so committing, branching, diffing and reading the log are
local operations that work with the network unplugged. In a centralized system — Subversion,
CVS — one server holds the authoritative history and the working copy holds little or none of
it, so most operations need a round trip to that server.

**Why it matters** This single architectural fact generates the misconception the rest of this
file keeps having to correct. In a centralized tool, committing *is* publishing: there is one
history and it lives on the server. In Git, committing writes to your own copy and nothing
leaves your machine until you push. A candidate carrying the centralized model into a Git
question will answer "the team can now see it" after a commit, which is wrong.

**How it works** Cloning copies the object database, not just the latest files, which is why a
clone is a full peer rather than a checkout: it can serve as the origin for someone else. There
is no privileged copy in Git's design — a repository is treated as authoritative only by team
convention, usually because everyone configured it as their remote.

**Key terms** clone; local history; offline operation; peer copy.

<a id="c-devops.git-concepts.repository"></a>
### Repository
*id: `devops.git-concepts.repository` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: progit-what-is-git*

**What it is** The project's complete history, stored in the `.git` directory at the project
root. Strictly, the repository is that directory; the project files sitting beside it are the
working tree, which is a checked-out view of one point in the history rather than part of the
history itself.

**Why it matters** The `.git`-directory boundary answers a family of practical questions:
copying a project folder without `.git` copies the files and none of the history; deleting
`.git` leaves the files intact and destroys every commit, branch and tag; and a "bare"
repository — one with no working tree — is exactly what a hosting server stores.

**How it works** `git init` creates an empty repository: a `.git` directory with subdirectories
for objects, `refs/heads` and `refs/tags`, plus an initial branch that has no commits in it yet.
`git clone` does more: it creates a new directory, copies the source repository's history into
it, creates remote-tracking branches for the source's branches, sets `remote.origin.url`, and
checks out a starting branch. So init gives you a repository with no remote and no commits;
clone gives you one that already has both.

**Key terms** `.git` directory; working tree; bare repository; remote-tracking branch.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git init` | Create an empty repository in the current directory | `--bare` no working tree, `-b`/`--initial-branch=<name>` name the first branch | `git init` | Fearing it will destroy an existing repository — re-running it in one is safe and does not overwrite what is already there |
| `git clone` | Copy an existing repository into a new directory | `--branch <name>` check out that branch, `--depth <n>` shallow history, `--single-branch`, `--bare` | `git clone https://example.com/project.git` | Using it where `git init` is meant: clone needs an existing source repository and configures `origin`; init creates a repository from nothing and configures no remote |

**Traps** "Repository" is not "the folder on GitHub" — the platform hosts a copy of a
repository, and your clone is an equally complete one. It is also not the working tree: a
question describing lost *files* and a question describing lost *history* have different
answers.

**What the exam may test** Choosing `git init` versus `git clone` for a stated starting point
(nothing yet, versus an existing project you want a copy of), and identifying where the history
physically lives.

<a id="c-devops.git-concepts.working-directory-staging-area-and-repository"></a>
### Working directory, staging area and repository
*id: `devops.git-concepts.working-directory-staging-area-and-repository` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: progit-what-is-git*

**What it is** Git's three states, and the single most important model in this competency. The
working directory (working tree) holds the files you are editing; the staging area (also called
the index) holds the exact content that will go into the next commit; the repository holds
commits already recorded. A change moves through all three in order, and every basic Git command
is best understood as moving something from one of these to the next.

**Why it matters** The staging area is what distinguishes Git from simpler
save-a-copy tools, and it is the reason a commit can contain a deliberate subset of your edits
rather than whatever the disk happens to hold. Almost every "why didn't my change appear"
question resolves to a change sitting in a state the candidate thought it had left.

**How it works** Editing a file changes only the working tree. `git add` copies that file's
content *as it is at that instant* into the index. `git commit` writes what the index holds —
nothing else — into a new commit. `git status` reports all three states in plain words:
"Changes to be committed" is the index, "Changes not staged for commit" is the working tree, and
"Untracked files" are paths Git has never been told about. Because `git add` snapshots content
rather than registering a file for future inclusion, editing a file again after adding it leaves
those later edits unstaged until you add it again.

**Key terms** index; staged; tracked versus untracked; snapshot of content.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git status` | Show which files are staged, modified but unstaged, or untracked | `-s` short format, `-b` show branch and tracking info even in short format | `git status` | Skimming past the "Untracked files" heading — an untracked file is not staged, not committed, and not protected by anything |
| `git add` | Copy the current content of a path into the index | `-A` stage all changes including deletions, `-u` only paths already tracked, `-p` choose hunk by hunk | `git add` | Assuming a file stays staged as it changes — `add` records content at the moment it runs, so edits made afterwards need another `add` |
| `git commit` | Record the contents of the index as a new commit | `-m <msg>` message inline, `-a` auto-stage modified and deleted tracked files | `git commit` | Believing `-a` stages everything — it stages modifications and deletions of already-tracked files, and never adds a new untracked file |

**Traps** `git commit -a` is not "commit everything": a brand-new file that Git has never seen
is untracked, so `-a` ignores it and the commit silently omits it. In the other direction,
`git add` on a file matched by `.gitignore` is refused rather than silently honoured when the
path is named explicitly.

**What the exam may test** Given a described situation — a file edited but not added, added but
not committed, or never tracked at all — naming both the state it is in and the one command that
moves it forward.

<a id="c-devops.git-concepts.commit"></a>
### Commit
*id: `devops.git-concepts.commit` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: progit-what-is-git*

**What it is** An immutable snapshot of the tracked project at one moment, carrying an author, a
committer, a timestamp, a log message, and a link to its parent commit (two parents for an
ordinary merge commit, and more for an octopus merge of several branches at once). It is
identified by a hash computed over that content, which is why a commit cannot be edited: any
change to it produces a different hash, and therefore a different commit.

**Why it matters** Two exam-relevant properties follow directly from that definition. First, a
commit is a snapshot, not a diff — the patch you see in `git log -p` is computed on demand
against the parent, not stored. Second, a commit is local: it exists in your repository and
nowhere else until it is pushed.

**How it works** `git commit -m "message"` takes whatever the index currently holds, writes it
as a new commit whose parent is the commit HEAD points at, and advances the current branch to
the new commit. `git log` then walks that parent chain backwards from HEAD. Because each hash
covers both content and parent, rewriting any commit necessarily gives new hashes to it and to
every commit descended from it — the mechanical reason `git rebase`, `git reset` and
`git commit --amend` are described as rewriting history rather than editing it.

**Key terms** hash (SHA); parent; HEAD; immutability.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git commit -m` | Record the staged content with a message given inline | repeat `-m` for extra paragraphs; `-m` is mutually exclusive with `-c`, `-C` and `-F` | `git commit -m "Add retry to the upload path"` | Treating the commit as published — it is recorded locally, and collaborators see nothing until a push |
| `git log` | Show the commits reachable from HEAD, newest first | `--oneline` one line each, `-p` show the patch, `-n <count>` limit | `git log` | Reading "my commit is missing" from its absence — `git log` shows only what is reachable from where you are, so a commit on another branch is simply not on this path |

**Traps** `git commit --amend` does not modify the previous commit; it builds a replacement with
a new hash and moves the branch to it, which is why amending something already pushed produces a
rejected push. And the immutability is of the commit object, not of the branch — branches move
freely over fixed commits.

**What the exam may test** Separating commit from push in a collaboration scenario, and
recognising that Git stores snapshots rather than deltas when a question describes what a commit
contains.

<a id="cmp-devops.git-concepts.commit"></a>
#### Not to be confused with: Commit vs Push
*compares: `devops.git-concepts.commit`, `devops.git-concepts.push`*

| | Commit | Push |
| --- | --- | --- |
| What it does | Records the staged content as a new commit in the local repository | Uploads local commits to a branch on a remote repository |
| Needs a network | No — it is entirely local | Yes |
| Who can see the result | Only you, until a push happens | Everyone with access to the remote |
| What it moves | The current branch pointer, in your own repository | The branch ref on the remote |
| Can be refused | No | Yes — a non-fast-forward update is rejected unless forced |

The separating axis is recording versus publishing: commit writes history into your own copy;
push is the separate, explicit act of making that history exist anywhere else.

<a id="c-devops.git-concepts.commit-messages"></a>
### Commit messages
*id: `devops.git-concepts.commit-messages` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: progit-what-is-git*

**What it is** The log message attached to a commit. The convention almost every project
follows is a short imperative summary line ("Fix retry limit on upload"), a blank line, and then
a body that explains why the change was made.

**Why it matters** The message is the only part of a commit that a later reader cannot
reconstruct from the repository. The diff already shows *what* changed, in complete detail and
forever; nothing else records *why*, or what alternative was rejected. That asymmetry is the
whole justification for the convention, and it is what an exam question about "good commit
message practice" is really asking about.

**How it works** `git commit -m` supplies the message inline and repeated `-m` options become
separate paragraphs; with no `-m`, Git opens an editor. The summary line is the part that
surfaces in condensed views such as `git log --oneline`, in blame output and in most hosting
interfaces, so it carries disproportionate weight relative to its length. The imperative mood
("Add", not "Added") is convention rather than a Git requirement — it reads as an instruction
describing what applying the commit does.

**Key terms** summary line; body; imperative mood; why versus what.

#### Scenario

A candidate edits two files, runs `git add` on both, then notices a typo in the first and fixes
it before running `git commit -m "Fix upload retry"`. The commit contains the first file as it
was when `add` ran, not as it is on disk — `git status` afterwards still lists it under "Changes
not staged for commit," because `add` snapshotted content rather than registering the file. They
then create a third file and run `git commit -a -m "Add helper"`, which records nothing from it:
the file is untracked, and `-a` covers only modifications and deletions of tracked files. Both
commits are now in the local repository — in `.git`, on this machine, visible to `git log` — and
neither is visible to a single colleague, because this is a distributed system where committing
and publishing are separate acts.

#### Knowledge check

1. What is the one-sentence difference between version control and backup?
   Version control records author-initiated revisions of files under active change so any prior
   revision and its authorship can be recovered; backup exists to survive loss of data or a
   system, runs on a schedule, and is measured in RPO and RTO.
2. Name Git's three states and the command that moves a change from each one to the next.
   Working directory to staging area with `git add`; staging area to repository with
   `git commit`; `git status` reports which state each change is currently in.
3. A file is staged, then edited again, then committed. Which version is in the commit?
   The version as it was when `git add` ran — `add` copies content into the index at that
   instant, so the later edits remain unstaged.
4. Does `git commit -a` commit a newly created file?
   No. It auto-stages modifications and deletions of files Git already tracks; an untracked file
   is unaffected and must be added explicitly.
5. Why can a commit never be edited in place?
   Its hash is computed over its content and its parent, so any alteration produces a different
   commit; `--amend`, rebase and reset all create replacement commits rather than modifying
   existing ones.
6. What belongs in a commit message that cannot be recovered from the repository otherwise?
   Why the change was made. The diff permanently records what changed, so the message's unique
   contribution is the reasoning.

<a id="s-git-concepts-branching"></a>
## Branching

<a id="c-devops.git-concepts.branch"></a>
### Branch
*id: `devops.git-concepts.branch` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: progit-branching-basics*

**What it is** A movable pointer to one commit, stored as a file of a few dozen bytes under
`refs/heads/`. A branch is not a copy of the project, not a directory, and not a container that
commits belong to — it is a name for one commit, and the commits "on" it are simply those
reachable from that commit by walking parents.

**Why it matters** Nearly every branching behaviour that looks arbitrary follows from the
pointer model. Creating a branch is instant because nothing is copied. Committing moves the
pointer forward. Deleting a merged branch loses nothing, because its commits are still reachable
from the branch it was merged into. And a fast-forward merge is possible precisely because
moving a pointer forward is all that is needed when nothing diverged.

**How it works** `git branch <name>` creates the pointer at the current commit and leaves you
where you are — it does not switch. `git switch <name>` moves HEAD to that branch and updates
the index and working tree to match it. `git switch -c <name>` and the older `git checkout -b
<name>` both create and switch in one step; `switch` and `restore` were added in Git 2.23
specifically to split `checkout`'s two unrelated jobs — moving between branches and restoring
file contents — into separate commands.

**Key terms** ref; HEAD; movable pointer; remote-tracking branch.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git branch` | List branches, or create one at the current commit | `-a` list local and remote-tracking, `-r` remote-tracking only, `-d` delete if merged, `-D` delete regardless, `-m` rename | `git branch` | Expecting `git branch feature` to switch to the new branch — it creates the pointer and leaves HEAD where it was |
| `git switch` | Move to an existing branch, updating index and working tree | `-c <name>` create and switch, `--detach` check out a commit with no branch | `git switch main` | Reaching for it to discard file changes — that is `git restore`; `switch` aborts rather than silently losing local modifications |
| `git checkout -b` | Create a branch and switch to it in one command | `-B` create or reset it to the start point | `git checkout -b feature/retry` | Assuming it is a different operation from `git switch -c` — they are equivalent for this case; `checkout` is simply the older, overloaded command |

**Traps** `git branch -d` refuses to delete a branch that is not fully merged into its upstream,
or into HEAD if it has no upstream; `-D` is shorthand for `--delete --force` and deletes it
anyway, leaving any commits that were reachable only from that branch reachable from nothing —
recoverable through the reflog until Git prunes them. Also, `origin/main` is not a branch you can
commit on — it is a remote-tracking branch, a local read-only record of where the remote's `main`
stood at your last contact with it.

**What the exam may test** Which single command creates a branch and switches to it, and
recognising the branch-as-pointer model in a question about what happens to commits when a
branch is deleted or merged.

<a id="c-devops.git-concepts.merge"></a>
### Merge
*id: `devops.git-concepts.merge` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: git-merge, progit-branching-basics*

**What it is** Joining two lines of development. Merging has two distinct outcomes, and the
whole examinable content of this topic is knowing which one applies. If the current branch's tip
is already an ancestor of the commit being merged — the branch you are merging into has not moved
since the other branch left it — Git performs a **fast-forward**: it moves HEAD and the branch
pointer forward to the named commit and **creates no merge commit at all**. Only when the two
histories have genuinely diverged does Git build a merge commit, a commit with both tips as its
parents.

**Why it matters** "Merging always creates a merge commit" is false, and it is a
plausible-sounding distractor precisely because it is true in the more visible case. The
documentation is explicit that in the fast-forward case no new commit is needed to store the
combined history, and that fast-forward updates therefore cannot even be stopped with
`--no-commit`.

**How it works** Git finds the merge base — the common ancestor of the two tips. If the merge
base is the current branch's tip, there is nothing to combine and the pointer simply advances.
Otherwise Git performs a three-way merge against that base: changes that touch different regions
are combined automatically, changes that touch the same region become conflicts, and on success
the result is committed as a merge commit whose parents are both branch tips. `--no-ff` forces a
merge commit even where a fast-forward was possible, which is how projects keep a visible record
that a feature branch existed; `--ff-only` does the opposite, refusing the merge outright unless
it can be resolved as a fast-forward.

**Key terms** merge base; fast-forward; merge commit; two parents.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git merge` | Join another branch's history into the current branch | `--no-ff` always create a merge commit, `--ff-only` refuse unless it fast-forwards, `--abort` back out of a conflicted merge | `git merge feature/retry` | Assuming a merge commit is always produced — where the target branch has not moved, Git fast-forwards the pointer and creates none |

**Traps** Merging does not delete or close the source branch; the branch pointer still exists
until you delete it. Merging never rewrites existing commits either — the pre-merge commits keep
their hashes on both sides, which is exactly what makes merge safe on shared branches and rebase
not. And the direction matters: `git merge feature` run while on `main` moves `main`, not
`feature`.

**What the exam may test** Given a scenario where `main` received no commits while a feature
branch advanced, stating what the history looks like after `git merge feature` — the pointer
moves, no merge commit appears — and knowing which option forces a merge commit anyway.

<a id="cmp-devops.git-concepts.merge"></a>
#### Not to be confused with: Merge vs Pull request vs Rebase
*compares: `devops.git-concepts.merge`, `devops.git-concepts.pull-request`, `devops.git-concepts.rebase`*

| | Merge | Pull request | Rebase |
| --- | --- | --- | --- |
| What it is | A Git command that joins two histories | A hosting platform's proposal to merge a branch, with review and checks attached | A Git command that replays commits onto a new base |
| Where it lives | In any repository, local or server-side | On the platform (GitHub, GitLab, Bitbucket) — no Git command opens one; `git request-pull` only prints a summary you send by hand | In a local repository |
| Effect on existing commits | None — they keep their hashes | None by itself; it is a request, not an operation | Replaced by new commits with new hashes |
| Produces a merge commit | Only when the histories diverged; never on a fast-forward | Whatever strategy the project configures when someone merges it | No — the point is linear history |
| Safe on a branch others have pulled | Yes | Yes | No — rewriting published commits forces everyone else to recover |

The separating axis is category: merge and rebase are two Git operations for integrating work,
one preserving history and one rewriting it, while a pull request is not an integration operation
at all but a platform's review wrapper placed around one.

<a id="c-devops.git-concepts.rebase"></a>
### Rebase
*id: `devops.git-concepts.rebase` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: git-rebase*

**What it is** Reapplying a series of commits on top of a different base commit. `git rebase
main` takes the commits on your branch that are not on `main`, resets your branch to `main`, and
replays those changes one at a time on top of it. The result looks as though you had started
your work from the current `main` all along — but the replayed commits are *new commits with new
hashes*, not the originals moved.

**Why it matters** That rewriting property is the entire crux. Rebase produces a linear history,
which is why teams like it, and it does so by discarding the original commit objects and
manufacturing replacements, which is why rebasing a branch other people have already pulled is
discouraged: their repositories still contain the old commits, so the two histories have
diverged even though the content is identical.

**How it works** Git saves the commits that are on your branch but not on the upstream, resets
the branch to the upstream tip — the documentation notes this has the same effect as
`git reset --hard <upstream>` — and then reapplies the saved commits in order. A commit that
introduces the same textual change as one already upstream is skipped. If a replay hits a
conflict the rebase pauses, and you continue with `--continue`, drop the offending commit with
`--skip`, or unwind the whole operation with `--abort`.

**Key terms** replay; upstream; linear history; rewritten hash.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git rebase` | Reapply the current branch's commits on top of another base | `-i` interactive, to reorder, squash or reword, `--onto <newbase>`, `--continue` / `--skip` / `--abort` | `git rebase main` | Treating it as a tidier merge — it replaces commits with new objects, so anyone who already pulled the old ones now has a divergent history |

**Traps** Rebase does not undo anything: it changes where commits sit in history, not what they
do, which is what separates it from revert and reset. It is also what `git pull --rebase`
performs, so a candidate who believes pull always merges will misread that flag. And it is not a
way to resolve a conflict — a rebase can produce conflicts of its own, once per replayed commit.

**What the exam may test** Identifying rebase as the option that rewrites history, choosing
merge over rebase for a branch that has already been shared, and recognising that the commits
after a rebase are not the commits before it.

*Not to be confused with [merge](git-concepts.md#cmp-devops.git-concepts.merge).*
*Not to be confused with [revert vs reset](git-concepts.md#cmp-devops.git-concepts.revert-vs-reset).*

<a id="c-devops.git-concepts.merge-conflict"></a>
### Merge conflict
*id: `devops.git-concepts.merge-conflict` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: git-merge, progit-branching-basics*

**What it is** What Git does when both sides changed the same region of the same file and it
cannot choose between them: it stops mid-operation, writes both versions into the working-tree
file bracketed by `<<<<<<<`, `=======` and `>>>>>>>` markers, and records the path as unmerged in
the index. A conflict is not an error, a bug or corruption — it is Git declining to guess, and
resolution is by definition manual.

**Why it matters** Conflict-resolution scenarios are a natural multiple-choice shape because the
resolution sequence has one correct order and several plausible wrong ones. There is no
`git resolve`: you edit the file, and then you stage it, and staging is what tells Git the
conflict is settled.

**How it works** Changes to non-overlapping regions are combined without comment; only
overlapping ones conflict. `git status` lists the affected paths under "Unmerged paths" and
states that `git add` is how you mark resolution. During the conflict, `git diff` shows a
combined three-way diff highlighting the changes from both the HEAD and MERGE_HEAD sides, which
is more informative than reading the markers alone. Once every conflicted file is edited and
added, `git commit` (or `git merge --continue`) completes the merge; `git merge --abort` throws
the whole attempt away and returns to the pre-merge state.

**Key terms** conflict markers; unmerged path; MERGE_HEAD; three-way merge.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git status` | List which paths are conflicted and what to do next | `-s` short format, where `UU` marks a path modified on both sides | `git status` | Ignoring it mid-conflict — it is the one place Git states both the unmerged paths and the command that resolves them |
| `git diff` | Show the conflicting changes as a combined diff from both sides | `--staged` compare the index with HEAD instead | `git diff` | Expecting it to show a normal two-sided patch during a conflict; it shows a three-way combined diff against HEAD and MERGE_HEAD |

**Traps** Git never validates a resolution. Deleting the markers and staging the file marks the
conflict resolved even if the resulting content is nonsense or drops one side entirely — the
correctness of the merge is entirely on you. Conflicts are also not exclusive to `git merge`:
rebase, cherry-pick and `git pull` all produce the same markers and the same resolution
sequence.

**What the exam may test** The correct resolution order — edit the file, `git add` it, then
commit — and knowing that `git merge --abort` is the way out rather than deleting files or
re-cloning.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `devops.git-concepts.head` | HEAD | A pointer to what is currently checked out — normally the name of the current branch, which is why committing advances that branch. | Confused with "the newest commit in the repository": HEAD is where *you* are, not where the project is furthest along, and in detached-HEAD state it names a commit directly with no branch to carry forward. It is also the default starting point for history commands, so `git log HEAD` and a bare `git log` show the same thing. |

#### Scenario

A developer branches off `main` with `git switch -c feature/retry`, makes three commits, and
finds that `main` has not moved in the meantime. `git merge feature/retry` from `main` therefore
fast-forwards: the `main` pointer advances three commits and no merge commit appears, which
surprises a reviewer looking for one. A second developer, whose own branch started before two
new commits landed on `main`, chooses `git rebase main` instead — their three commits are
replayed on the new tip as three new commits with new hashes, and the second replay hits a
conflict in a file both sides edited. `git status` lists it under "Unmerged paths"; they edit the
file, remove the markers, `git add` it, and continue. Had they already pushed that branch and
had a colleague pulled it, the rebase would have been the wrong choice, because the colleague
now holds commits that no longer exist upstream.

#### Knowledge check

1. Does merging always create a merge commit?
   No. When the target branch's tip is already an ancestor of the commit being merged, Git
   fast-forwards the pointer and creates no merge commit; `--no-ff` forces one anyway.
2. What is the one-sentence difference between merge and rebase?
   Merge preserves both existing histories and joins them, leaving every commit's hash intact;
   rebase replays commits onto a new base as new commits with new hashes, rewriting history.
3. `git branch feature` was run and the next commit did not land on `feature`. Why not?
   `git branch` only creates the pointer; it does not switch. HEAD was still on the previous
   branch, so the commit advanced that one. `git switch -c feature` or `git checkout -b feature`
   would have done both.
4. What single command marks a conflicted file as resolved?
   `git add` on that file. There is no separate resolve command, and Git does not check whether
   the content you staged is a sensible merge.
5. What does HEAD point at, and how does that differ from the tip of `main`?
   HEAD names what is currently checked out, normally via the current branch. It coincides with
   `main`'s tip only when `main` is the branch you are on and you are up to date with it.
6. Why is rebasing a branch that colleagues have already pulled discouraged?
   Their clones still hold the original commits, which no longer exist after the rewrite, so the
   histories diverge and their next push or pull has to reconcile two versions of the same work.

<a id="s-git-concepts-collaboration"></a>
## Collaboration

<a id="c-devops.git-concepts.remote-and-origin"></a>
### Remote and origin
*id: `devops.git-concepts.remote-and-origin` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: progit-what-is-git, git-pull*

**What it is** A remote is a short name bound to the URL of another copy of the repository, so
you can write `origin` instead of a URL. `origin` is a convention, not a keyword: it is simply
the name `git clone` assigns to the repository it cloned from, and it can be renamed or removed
like any other.

**Why it matters** Multi-remote setups are ordinary — a contributor's own server-side copy as
`origin` and the original project as `upstream` — and questions about "pushing to the wrong
place" or "why is my branch behind" turn on knowing that these names are configuration, and that
`origin/main` is a local object, not a live view of the server.

**How it works** Clone sets `remote.origin.url` and a fetch refspec that maps the remote's
branches into `refs/remotes/origin/*`. Those remote-tracking branches — `origin/main` and its
siblings — are your repository's record of where the remote's branches stood the last time you
communicated with it. They update on fetch, pull and push, and at no other time, which is why a
remote-tracking branch can be stale without anything being wrong.

**Key terms** remote name; URL; remote-tracking branch; upstream.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git remote -v` | List the configured remotes with their fetch and push URLs | `-v` must sit between `remote` and any subcommand; `add`, `rename`, `remove`, `set-url` manage entries | `git remote -v` | Placing `-v` after the subcommand — the documentation is explicit that it must come between `remote` and the subcommand |

**Traps** `origin` carries no special authority in Git; the "authoritative" repository is a team
agreement, not a technical property. And `origin/main` is not the remote's branch — it is a
read-only local pointer, so a report that you are "behind by 4 commits" describes the last fetch,
not the server right now.

**What the exam may test** What `origin` actually denotes, which command lists remotes and their
URLs, and the distinction between a remote (a named URL) and a remote-tracking branch (a local
pointer).

<a id="c-devops.git-concepts.push"></a>
### Push
*id: `devops.git-concepts.push` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: progit-what-is-git, git-push*

**What it is** Uploading commits from your local repository to a branch on a remote, which is
the only thing that makes them visible to anyone else. Committing records a snapshot in the
local repository; nothing reaches the remote until a push.

**Why it matters** The commit/push split is the single most common misconception carried in from
centralized tools, and the second-order facts — where a bare `git push` sends things, and why a
push gets rejected — are the ones that separate a candidate who has memorised the command from
one who understands it.

**How it works** With no arguments, `git push` sends the current branch to its configured
upstream, held in `branch.<name>.remote` and `branch.<name>.merge`. A branch with no upstream has
no destination and Git refuses rather than guessing. `git push -u origin main` does both jobs at
once: it pushes, and `-u` (`--set-upstream`) records that upstream for the branch, so a later
bare `git push` — and a bare `git pull` — knows where to go. Separately, the remote refuses any
update where its current commit is not an ancestor of what you are sending, because applying it
would discard commits the remote already has. That is the non-fast-forward rejection, and the
correct response is to fetch and integrate the remote's work, then push again.

**Key terms** upstream (tracking) reference; non-fast-forward rejection; `--force-with-lease`;
publication.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git push` | Send the current branch's commits to its configured upstream | `--force` disable the fast-forward check, `--force-with-lease` refuse if the remote moved since you last saw it, `--tags` include tags, `--all` all branches | `git push` | Assuming tags travel with it — refs under `refs/tags` are not pushed unless `--tags`, `--follow-tags`, or the tag itself is named |
| `git push -u origin main` | Push `main` to `origin` and record that as the branch's upstream | `-u` is `--set-upstream`; the remote and branch names are arguments, not fixed words | `git push -u origin main` | Repeating the full form forever — once the upstream is set, a bare `git push` resolves the same destination |

**Traps** A rejected push is usually not a permissions problem. The documentation notes it also
happens in a repository nobody else pushes to: amend or rebase a commit you already pushed, and
the replacement is no longer a descendant of what the remote holds. `--force` resolves it by
letting the remote lose commits, which is why it is the wrong reflex on a shared branch;
`--force-with-lease` at least refuses when the remote has moved since your last fetch.

**What the exam may test** Distinguishing commit from push in a "why can't my colleague see
this" scenario, identifying what `-u` adds to a push, and choosing fetch-and-integrate over
`--force` as the fix for a non-fast-forward rejection.

*Not to be confused with [commit](git-concepts.md#cmp-devops.git-concepts.commit).*

<a id="c-devops.git-concepts.fetch-vs-pull"></a>
### Fetch vs pull
*id: `devops.git-concepts.fetch-vs-pull` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: git-pull, git-merge*

**What it is** Two ways of getting the remote's new commits, differing in whether they touch your
work. `git fetch` downloads commits and updates your remote-tracking branches, and changes
nothing about your current branch, your index or your working tree. `git pull` runs that same
fetch and then immediately integrates the result into the current branch — by default a merge,
or a rebase if configured or asked for.

**Why it matters** Fetch cannot surprise you; pull can. A pull may fast-forward silently, create
a merge commit, drop you into a conflict, or start a rebase in the middle of unrelated work. When
a scenario says "see what has changed upstream before deciding what to do," the answer is fetch.

**How it works** Fetch writes into `refs/remotes/<remote>/*` and records what it retrieved in
`.git/FETCH_HEAD`; afterwards `git status` may report your branch as behind, and your files are
untouched — the update requires a separate merge or rebase. Pull is literally fetch followed by
`git merge` or `git rebase`. If the current branch is merely behind, that integration
fast-forwards. If the two histories have diverged, current Git will not guess: `--ff-only` is the
default when no reconciliation method is given, so the pull stops until you specify `--rebase`,
`--no-rebase`, or the `pull.rebase` configuration.

**Key terms** remote-tracking branch; FETCH_HEAD; fast-forward; `pull.rebase`.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git fetch` | Download remote commits and update remote-tracking branches only | `--all` every remote, `--prune` delete remote-tracking refs whose remote branch is gone, `--tags` | `git fetch` | Expecting your working files to change — fetch never touches the working tree or the current branch |
| `git pull` | Fetch, then integrate the result into the current branch | `--rebase` integrate by rebasing, `--no-rebase` by merging, `--ff-only` only if it fast-forwards | `git pull` | Describing it as "download" — it is download plus integrate, which is why it can raise a conflict and fetch cannot |

**Traps** After a fetch, nothing about your branch has changed even though `git log origin/main`
now shows new commits — the two are different refs. And `git pull --rebase` is not a gentler
pull; it is a rebase, with every history-rewriting consequence that carries for commits you have
already pushed.

**What the exam may test** Choosing fetch when the requirement is inspection without disturbance,
and knowing that pull is a compound operation whose second half is a merge unless told otherwise.

<a id="c-devops.git-concepts.clone-vs-fork"></a>
### Clone vs fork
*id: `devops.git-concepts.clone-vs-fork` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: progit-what-is-git*

**What it is** Two different copies at two different layers. Cloning is a Git operation that
copies a repository from a URL into a new directory on your machine, with its full history.
Forking is a hosting-platform operation that creates your own server-side copy of someone else's
repository under your account. There is no `git fork` command, because forking is not something
Git does.

**Why it matters** The pair defines the standard contribution route when you lack write access to
a project: fork it on the platform, clone your fork locally, branch, commit, push to your fork —
which you can write to — and then open a pull request against the original. A candidate who
thinks cloning grants push access will pick the wrong first step.

**How it works** `git clone <url>` creates the target directory, copies the object database,
creates remote-tracking branches for the source's branches, sets `remote.origin.url`, and checks
out a starting branch. A fork lives entirely on the platform until you clone it; contributors
then commonly add the original repository as a second remote, conventionally named `upstream`,
so they can fetch the project's new commits into their own copy.

**Key terms** fork; `origin`; `upstream`; write access.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git clone` | Copy a repository into a new local directory | `--branch <name>`, `--depth <n>` shallow clone, `--single-branch`, `--bare` | `git clone` | Believing it confers permission — clone copies what you can read; whether you may push is decided by the remote, not by having a clone |

**Traps** Forking puts nothing on your machine and cloning puts nothing on a server; the two
solve different halves of the problem and the contribution workflow needs both. Note also that
"fork" carries a second, older meaning in open source — taking a project in a permanently
independent direction — which is a governance act, not a button.

**What the exam may test** Choosing fork versus clone given a stated permission situation, and
recognising that the platform's fork feature is not a Git command.

<a id="cmp-devops.git-concepts.clone-vs-fork"></a>
#### Not to be confused with: Clone vs fork vs Forking a project
*compares: `devops.git-concepts.clone-vs-fork`, `pm.open-source-software-and-licensing.forking-a-project`*

| | Clone vs fork | Forking a project |
| --- | --- | --- |
| What it names | Copying a repository — locally with `git clone`, or server-side with a platform's fork feature | Taking a project's code in a new, independently maintained direction |
| Intent | Stay aligned with the original and send changes back | Diverge from the original maintainers permanently |
| Who does it, how often | Any contributor, routinely, as the first step of a change | A community or vendor, rarely and deliberately, usually after a governance dispute |
| What makes it possible | The hosting platform's copy feature, plus Git's clone | The licence — open source licences explicitly protect this right |
| Usual outcome | Changes return to the original via a pull request | Two separate projects with separate maintainers and releases |

The separating axis is whether the copy is meant to come back: a platform fork or a clone is a
mechanical copy made in order to contribute, while forking a project in the open source sense is
a permanent split that the licence, not the platform, makes possible.

<a id="c-devops.git-concepts.pull-request"></a>
### Pull request
*id: `devops.git-concepts.pull-request` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: none*

*No primary documentation source. The authoritative references are paywalled (see
`data/sourcing-waivers.json`). Treat the following as consensus practice, not citable fact.*

**What it is** A proposal, raised on a hosting platform rather than in Git, to merge one branch
into another — and, in practice, the place where code review comments and automated checks
attach to a change before it is integrated. GitHub and Bitbucket typically call it a pull
request; GitLab calls the same thing a merge request.

**Why it matters** It is the process layer, not a Git mechanism. An exam question can put
`git merge` and "open a pull request" side by side as though they were the same act; they are
not, because opening a request changes no history at all — it only asks that a merge be
performed later, after whatever review the project requires.

**How it works** In most implementations of this practice, a contributor pushes a branch to a
repository they can write to — their own fork, or a branch in the shared repository — and then
opens a request naming that branch as the source and some target branch, typically `main`. The
platform usually displays the diff against the target, runs whatever automated checks the project
has configured, and collects review comments. Merging is then generally carried out by the
platform on the server, using whichever strategy the project has selected — a merge commit, a
squash, or a rebase — so the shape of the resulting history is typically a platform setting
rather than a property of the request.

**Key terms** merge request; review; status check; target branch.

**Traps** There is no `git pull-request` command, and opening a request runs no `git pull`: the
name describes asking someone else to pull your branch, which is as far as Git itself goes with
`git request-pull`, a command that only prints a summary for you to send by hand. Typically,
pushing further commits to the source branch updates the open request rather than requiring a new
one, so "open another pull request to fix the review comments" is usually the wrong answer.

**What the exam may test** Recognising the pull request as a platform-level review wrapper around
a merge rather than a Git operation, and knowing that "merge request" names the same thing on a
different platform.

*Not to be confused with [merge](git-concepts.md#cmp-devops.git-concepts.merge).*

<a id="c-devops.git-concepts.tag"></a>
### Tag
*id: `devops.git-concepts.tag` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: progit-tagging*

**What it is** A fixed label on one commit, stored under `refs/tags/` and conventionally used to
mark a release — `v1.4.0` and the like. The defining contrast with a branch is that a tag does
not move: committing advances a branch, and leaves every tag exactly where it was.

**Why it matters** Branch and tag are both names pointing at a commit, which makes them
interchangeable-looking in a question stem. Movable versus fixed is the distinction that decides
which one a scenario needs, and "mark this exact commit as the release we shipped" needs the
fixed one.

**How it works** `git tag <name>` creates a lightweight tag: a bare reference to an object, with
no metadata of its own. `git tag -a <name> -m "<message>"` creates an annotated tag, which is a
real object in the database carrying the tagger's name and email, a creation date, a message, and
optionally a GPG signature — and per the documentation, supplying `-m` without `-a`, `-s` or `-u`
implies `-a`. The documentation describes annotated tags as meant for releases and lightweight
tags as meant for private or temporary labels. `git tag` with no arguments lists the tags that
exist.

**Key terms** lightweight tag; annotated tag; `refs/tags/`; release marker.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git tag` | Create, list or delete tags | `-a` annotated tag object, `-m <msg>` message (implies `-a`), `-d` delete, `-l <pattern>` list matching | `git tag -a v1.4.0 -m "Release 1.4.0"` | Expecting a plain `git push` to publish it — tags are not pushed by default; push them with `--tags`, `--follow-tags`, or by naming the tag |

**Traps** A tag is not a branch you can work on: checking one out leaves you in detached HEAD,
with no branch to advance, so commits made there belong to nothing until you create a branch. And
the lightweight/annotated split matters for releases specifically, because only the annotated form
records who tagged it and when.

**What the exam may test** Choosing a tag rather than a branch to mark a release, and knowing
that annotated tags carry tagger metadata and a message while lightweight tags carry none.

#### Scenario

A contributor wants to fix a bug in a project they cannot push to. They fork it on the platform,
`git clone` their fork, and see from `git remote -v` that `origin` is their own copy, not the
original — so they add the project as a second remote named `upstream`. They branch, commit, and
run `git push`, which fails because the new branch has no upstream; `git push -u origin fix/retry`
pushes and records the destination, and every later push on that branch is a bare `git push`.
They open a pull request against the original project, which changes no history and merely asks
for the merge. While review runs, the project's `main` advances; they use `git fetch upstream` to
see the new commits without disturbing their working tree, since a `git pull` at that moment
would have integrated them into the branch under review. After the maintainers merge and cut a
release, the release itself is marked not with a branch but with an annotated tag on the exact
commit shipped.

#### Knowledge check

1. What is the one-sentence difference between a commit and a push?
   A commit records a snapshot in your local repository; a push uploads commits to a branch on a
   remote, and until it happens no collaborator can see anything.
2. `git push` is rejected as a non-fast-forward. What does that mean, and what is the correct
   response?
   The remote holds commits that are not ancestors of what you are sending, so applying your
   push would discard them. Fetch and integrate the remote's work, then push again; `--force`
   fixes it only by letting the remote lose those commits.
3. What does `-u` add to `git push -u origin main`?
   It sets `origin/main` as the branch's upstream, so a later bare `git push` or `git pull`
   resolves the same remote and branch without arguments.
4. You want to see what changed upstream without touching your current work. Fetch or pull?
   Fetch. It updates remote-tracking branches only; pull would fetch and then integrate into the
   current branch.
5. `origin/main` says you are four commits behind. Is the remote definitely four commits ahead
   right now?
   No. `origin/main` is a local record of the remote as of your last fetch, pull or push, not a
   live view; the remote may have moved further since.
6. A contributor with no write access wants to submit a change. What is the order of operations?
   Fork on the platform, clone the fork, branch and commit locally, push to the fork, then open a
   pull request against the original repository.
7. Which command marks a specific commit as release `v2.0`, and which variant records who made
   the mark?
   `git tag`; the annotated form (`git tag -a v2.0 -m "..."`) creates a tag object carrying the
   tagger's name, email, date and message, where a lightweight tag carries none.

<a id="s-git-concepts-practice"></a>
## Practice

<a id="c-devops.git-concepts.gitignore"></a>
### .gitignore
*id: `devops.git-concepts.gitignore` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: gitignore*

**What it is** A file of patterns naming paths Git should treat as intentionally untracked —
build output, dependency directories, local editor settings, and above all credentials. Its scope
is stated in the first line of the documentation and is the whole exam trap: it specifies
intentionally *untracked* files, and files already tracked by Git are not affected by it.

**Why it matters** That limitation converts directly into the most consequential Git mistake an
IT associate can make. Adding a leaked secret to `.gitignore` after it has been committed removes
nothing: the secret is in the history, it is in every clone anyone has taken, and it stays there
until the history is rewritten. Even then the only reliable remediation is to treat the
credential as compromised and rotate it, because you cannot recall the copies that already left.

**How it works** Patterns are read, highest precedence first, from the command line, then from
`.gitignore` files in the path's own directory and its parents — with lower-level files
overriding higher-level ones — then from `$GIT_DIR/info/exclude`, then from the file named by
`core.excludesFile`. Within one precedence level the last matching pattern decides, and a leading
`!` re-includes a path an earlier pattern excluded. A `.gitignore` file is committed and so
travels with a clone, which is why shared patterns go there; `info/exclude` stays local to one
repository, and `core.excludesFile` applies to one user across all of them.

**Key terms** untracked; precedence order; `info/exclude`; negation pattern.

<a id="c-devops.git-concepts.revert-vs-reset"></a>
### Revert vs reset
*id: `devops.git-concepts.revert-vs-reset` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: git-revert, git-reset*

**What it is** The two opposite ways of undoing, distinguished by what they do to history.
`git revert <commit>` records a *new* commit that applies the inverse of an existing one, leaving
the original in place — history grows, nothing is rewritten, and the operation is therefore safe
on a branch other people have. `git reset` moves the current branch pointer to another commit,
optionally changing the index and working tree with it, so commits the branch passes over stop
being part of it — history is rewritten.

**Why it matters** "Undo a bad commit that has already been pushed" has exactly one safe answer,
and the wrong one is attractive: reset looks cleaner because it makes the mistake disappear. On a
shared branch, that disappearance is the problem — the next push is rejected as a non-fast-forward,
and forcing it takes commits away from everyone else.

**How it works** Revert requires a clean working tree, applies the reverse of the named commit,
and commits the result with a generated message; `-n` applies the inverse to the index and
working tree without committing, so several reverts can be combined. Reset's three common modes
differ only in how far the change propagates: `--soft` moves HEAD and leaves both index and
working tree alone, so the undone changes remain staged; `--mixed`, the default, resets the index
but not the working tree, so they remain as unstaged edits; `--hard` resets index and working
tree together, discarding tracked changes since that commit. Given a path instead of a commit,
`git reset <path>` is the exact opposite of `git add <path>` — it unstages.

**Key terms** inverse commit; `--soft` / `--mixed` / `--hard`; unstage; shared branch.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git revert` | Record a new commit that undoes an earlier one | `-n`/`--no-commit` apply the inverse without committing, `--continue` / `--abort` when it conflicts | `git revert 9fceb02` | Expecting the original commit to vanish — revert adds an inverse commit and keeps the original, which is exactly what makes it safe after pushing |
| `git reset` | Move the branch pointer, optionally adjusting index and working tree | `--soft` HEAD only, `--mixed` index too (default), `--hard` index and working tree | `git reset` | Reaching for `--hard` to unstage — the default `--mixed` unstages while keeping your edits; `--hard` discards tracked changes with no commit to recover them from |

**Traps** `git reset --hard` destroys uncommitted work in tracked files silently and immediately;
there is no commit holding it, so there is nothing to check out. Reset also is not `git restore`:
restoring a file's contents from a commit is `git restore`'s job. And reverting a revert reapplies
the original change, because each revert is just another ordinary commit.

**What the exam may test** Choosing revert for a commit that has been pushed and reset for a
mistake still local, and matching each reset mode to what it leaves behind — staged, unstaged, or
gone.

<a id="cmp-devops.git-concepts.revert-vs-reset"></a>
#### Not to be confused with: Revert vs reset vs Rebase
*compares: `devops.git-concepts.revert-vs-reset`, `devops.git-concepts.rebase`*

| | Revert vs reset | Rebase |
| --- | --- | --- |
| What it is for | Making a change go away: revert cancels it, reset drops it off the branch | Moving a series of commits onto a different base |
| Effect on existing commits | revert keeps the original and adds an inverse; reset leaves them behind, unreferenced by this branch | Replaces them with replayed commits carrying new hashes |
| Rewrites history | revert no; reset yes | Yes |
| Safe after pushing | revert yes; reset no | No |
| Changes what the code does | Yes — that is the point | No — the same changes end up in a different place in history |

The separating axis is purpose: revert and reset answer "make this change stop being in effect,"
while rebase answers "put this work somewhere else in the history" and alters no outcome at all.

<a id="c-devops.git-concepts.git-diff-and-git-log"></a>
### git diff and git log
*id: `devops.git-concepts.git-diff-and-git-log` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: progit-what-is-git*

**What it is** The two inspection commands, answering two different questions. `git log` answers
"what happened" — which commits exist on this path through history, by whom, when, and with what
message. `git diff` answers "what changed" — the line-level content difference between two
things. Neither modifies anything.

**Why it matters** The examinable part is not that they exist but which pair of states a bare
`git diff` compares, because that is where candidates guess. Bare `git diff` compares the working
tree with the index: it shows what you could still stage, which means it shows *nothing* once you
have staged everything, even though the last commit is plainly different from your files.

**How it works** `git diff --staged` (with `--cached` as a synonym) compares the index with HEAD
— that is, exactly what a commit right now would record. `git diff <commit>` compares the working
tree with that commit, and `git diff <commit> <commit>` compares two commits. `git log` walks
parents backwards from HEAD, so it lists only commits reachable from where you are; `--oneline` is
shorthand for `--pretty=oneline --abbrev-commit`, printing one abbreviated hash and subject line
per commit.

**Key terms** working tree versus index; `--staged`; reachability; abbreviated hash.

**Commands**

| Command | Purpose | Key options | Example | Common mistake |
| --- | --- | --- | --- | --- |
| `git diff` | Show the difference between the working tree and the index | `--staged`/`--cached` index against HEAD, `--stat` summary, `--name-only` paths only | `git diff` | Concluding nothing changed when it prints nothing — after `git add`, the change is in the index, and `--staged` is what shows it |
| `git log --oneline` | List reachable commits, one abbreviated line each | `--graph` draw the branch topology, `-n <count>` limit, `-p` include patches | `git log --oneline` | Reading it as the whole repository's history — it shows what is reachable from HEAD, so commits on unmerged branches do not appear |

**Traps** A commit that does not appear in `git log` is not lost; it is unreachable from the
current HEAD, which is a different claim. Naming the branch (`git log other-branch`) or `--all`
brings it into view. Conversely, `git diff main feature` is not the same as the merge result — it
is a plain endpoint comparison, and it brings in the merge base only when you ask for it, with
`--merge-base` or the three-dot `git diff main...feature` form.

**What the exam may test** Matching a stated question — "what would this commit contain," "what
have I changed since the last commit," "who touched this and when" — to the right command and
option, rather than reaching for a bare `git diff` for all three.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `devops.git-concepts.stash` | Stash | `git stash` records the current working-tree and index changes, then reverts the working directory to match HEAD, so you can switch context with a clean tree and restore the work later with `git stash pop`. | Confused with committing: a stash is not history. It sits in `refs/stash`, belongs to no branch, is never pushed to a remote, and is invisible to collaborators and to `git log`, so "stash it so the team can see it" is always wrong. |
| `devops.git-concepts.branching-strategies` | Branching strategies | Team conventions — trunk-based development, feature branching, release branches, and similar — governing how work travels from a developer to the main line. | Recognition only: these are agreements, not Git features. Git enforces none of them and offers no command for any of them, so a question naming a strategy is asking about team process, not about a command or an option. |

#### Scenario

A developer commits a config file that contains an API key, pushes it, and then adds the file to
`.gitignore`. Nothing improves: `.gitignore` governs untracked files only, the file is already
tracked and already in history, and every clone taken since carries the key — the only sound
remediation is to rotate the credential. To undo the change itself they must choose: the commit is
pushed, so `git revert` is the safe option, adding an inverse commit that leaves history intact,
where `git reset` would drop the commit off the branch and make the next push a non-fast-forward.
Before deciding, they check the damage with `git log --oneline` to find the offending commit and
`git diff` between that commit and its parent to see exactly what it introduced — and discover a
second, unstaged edit sitting in the working tree, which they set aside with `git stash` so the
revert runs against a clean tree.

#### Knowledge check

1. A secret was committed and pushed. Does adding it to `.gitignore` remove it?
   No. `.gitignore` affects untracked files only; a tracked file is unaffected and the secret
   remains in history and in every existing clone. Rotate the credential.
2. What is the one-sentence difference between `git revert` and `git reset`?
   Revert adds a new commit that cancels an old one and leaves history intact; reset moves the
   branch pointer so commits fall off the branch, rewriting history.
3. Which `git reset` mode leaves your changes staged, which leaves them as unstaged edits, and
   which discards them?
   `--soft` leaves them staged, `--mixed` (the default) leaves them unstaged, `--hard` discards
   tracked changes entirely.
4. You run `git add .` and then `git diff`, and it prints nothing. Has anything changed?
   Yes. Bare `git diff` compares the working tree with the index, and staging moved the changes
   into the index; `git diff --staged` compares the index with HEAD and will show them.
5. Is a stash a commit on the current branch?
   No. It is stored under `refs/stash`, belongs to no branch, is not pushed to any remote, and
   does not appear in `git log`.
6. Is trunk-based development something Git enforces?
   No. Branching strategies are team conventions; Git provides branches and no opinion about how
   they are used.
