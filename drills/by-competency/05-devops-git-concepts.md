<!-- GENERATED FILE — do not edit.
     Rebuilt by `npm run build-exams` from questions/**.
     Editing this file by hand will be overwritten on the next build. -->

# Drill — DevOps Fundamentals :: Git Concepts

38 question(s), every question in the bank for this scope, in concept order.

Answers follow each question, so this is study material rather than a timed test.

---

### 1.

A developer runs `git branch feature/retry` while on `main`, then immediately makes a commit. On which branch does the new commit land, and why?

- **A.** On `feature/retry`, because creating a branch also checks it out
- **B.** Still on `main`: `git branch` only creates the new pointer at the current commit and does not move HEAD, so the developer never left `main`.
- **C.** On both branches at once, since a new branch starts as an exact copy of the one it was created from and stays synchronized with it until deleted.
- **D.** On neither, because the commit is left unattached until a branch is explicitly switched to

**Answer: B.** A branch is a movable pointer stored under `refs/heads/`, and `git branch <name>` creates that pointer at the current commit without switching to it. `git switch -c <name>` and the older `git checkout -b <name>` both create and switch in one step, which is the distinct behaviour this question is testing against.

- A is wrong: That is what `git switch -c` or `git checkout -b` do; plain `git branch` creates the pointer and deliberately leaves you where you were.
- C is wrong: A branch is a single pointer to one commit, not a copy of the project; a commit advances exactly one branch — whichever one HEAD currently names.
- D is wrong: HEAD always names some branch or commit; the developer stayed on `main` throughout, so the commit is not orphaned, it simply advances `main`.

### 2.

A developer wants to create a branch named `hotfix/login` and start working on it in one step, using the older, more widely recognised form of the command rather than the newer split commands. Which single command does both at once?

- **A.** `git branch hotfix/login`, since branch creation is what starts new work
- **B.** `git switch hotfix/login`, since `switch` is the command for moving onto a branch
- **C.** `git tag hotfix/login`, followed by checking that fixed label out to begin editing, since a tag can be checked out the same way a branch can.
- **D.** `git checkout -b hotfix/login`, the pre-2.23 command that both creates and switches to the branch

**Answer: D.** `git switch -c <name>` and the older `git checkout -b <name>` were both built to create a branch and switch to it in one step; `switch` and `restore` were added in Git 2.23 specifically to split `checkout`'s two unrelated jobs — moving between branches and restoring file contents — into separate commands, but the older combined form still works the same way.

- A is wrong: This creates the pointer but leaves HEAD on the current branch; it does not switch, so it does not satisfy "start working on it."
- B is wrong: Plain `switch` moves to a branch that already exists; without `-c` it refuses when the named branch is not there yet, rather than creating it.
- C is wrong: A tag is a fixed label meant to mark a point such as a release; checking one out leaves you in detached HEAD with no branch to advance as you commit.

### 3.

A team adopts trunk-based development and expects Git to enforce short-lived branches and frequent merges to `main` on its own. Will Git do that?

- **A.** Yes — Git rejects a commit if it lands on a branch older than a configured age limit under trunk-based development, once the team enables that convention somewhere in their shared repository configuration.
- **B.** No. Trunk-based development, feature branching and similar strategies are team conventions governing how work travels to the main line; Git provides branches and no opinion about how they are used.
- **C.** Yes, since `git branch -d` refuses to delete a branch that has not been merged, which enforces frequent merging
- **D.** Yes, because `git merge --ff-only` is the default merge behaviour and forces short-lived branches to stay caught up

**Answer: B.** Branching strategies such as trunk-based development, feature branching and release branches are conventions governing how work travels from a developer to the main line. Git enforces none of them and offers no command for any of them, so a question naming a strategy is asking about team process, not about a command or an option.

- A is wrong: Git has no such age-based enforcement mechanism; a branch can live indefinitely without any commit being rejected for it.
- C is wrong: That protects against losing unmerged commits on deletion; it says nothing about how often branches must be merged, and `-D` overrides it anyway when someone wants to.
- D is wrong: `--ff-only` is not Git's default merge behaviour, and even where used it only refuses a non-fast-forward merge — it does not compel branches to be short-lived.

### 4.

A block on this concept also compares it to "forking a project" in the open-source-licensing sense. What separates a platform fork (or a plain `git clone`) from that older meaning of "fork"?

- **A.** A platform fork always changes ownership of the original project immediately and permanently, while an open-source fork leaves the original maintainers in full and undisputed control of the code, its releases, its trademark, and its governance going forward indefinitely.
- **B.** Whether the copy is meant to come back: a platform fork or clone is a mechanical copy made in order to contribute changes back, while forking a project in the open-source sense is a permanent, licence-enabled split into two separately maintained projects.
- **C.** There is no real difference; both terms describe the exact same server-side copy operation performed by the same button on the same hosting platform.
- **D.** A platform fork requires a `git fork` command, while the open-source sense requires only a licence change filed with the project's chosen governing foundation.

**Answer: B.** Clone versus fork, and forking-a-project in the open-source sense, share only the word: a platform fork or a `git clone` is a mechanical copy made routinely, by any contributor, in order to send changes back; forking a project is a rare, deliberate, permanent split that a project's open-source licence explicitly protects the right to make.

- A is wrong: A platform fork changes nothing about the original repository or its ownership; it only creates a separate server-side copy under the forker's own account.
- C is wrong: The two senses share a word but not a meaning: one is a routine, frequent contribution step, the other a rare and deliberate community split, usually after a governance dispute.
- D is wrong: There is no `git fork` command at all — forking is a hosting-platform feature, not something Git itself does — so neither sense of the word involves one.

### 5.

A contributor has read access but no write access to a project's hosted repository and wants to submit a bug fix without asking the maintainers to change their access settings. What is the correct first step, given that write access is decided by the remote, not by having a copy of the code?

- **A.** `git clone` the original repository directly, since a clone always grants push access to wherever it was copied from once the URL resolves and the transfer finishes successfully.
- **B.** Fork the project on the hosting platform first, to obtain a server-side copy the contributor can push to, then `git clone` that fork locally.
- **C.** Open a pull request against the original repository directly, without cloning or forking anything first.
- **D.** Ask an administrator to add the contributor as a collaborator with write access to the original repository.

**Answer: B.** Cloning is a Git operation that copies a repository with its full history into a new local directory; forking is a hosting-platform operation that creates a server-side copy under the contributor's own account. The standard route when write access is missing is fork on the platform, `git clone` the fork locally, then push changes to the fork the contributor can write to.

- A is wrong: Clone copies what the contributor can read; whether they may push is decided entirely by the remote's permissions, and cloning changes none of that.
- C is wrong: A pull request names a source branch that must already exist somewhere the contributor can push to; without a fork or write access, there is no branch of theirs to name.
- D is wrong: Being granted write access is a change to the project's access settings, which the stem rules out; forking needs no action from the maintainers at all.

### 6.

A reviewer asks a contributor to improve a commit message that currently reads only "fix." What information does a good message add that the diff itself can never supply?

- **A.** Why the change was made, and what alternative was considered and rejected — reasoning the diff cannot show at all.
- **B.** A complete restatement of which lines were added or removed, for readers who skip the diff
- **C.** The author's name and the commit's timestamp, since those are otherwise missing from the commit and have to be supplied somewhere in its metadata by hand
- **D.** Which branch the commit belongs to, so `git log` can group commits by branch

**Answer: A.** The convention of a short imperative summary followed by a body exists because the diff already shows what changed, in complete and permanent detail, while nothing else in the repository records why the change was made or what was rejected along the way.

- B is wrong: That information is exactly what the diff already shows permanently; repeating it in the message adds nothing the repository does not already provide.
- C is wrong: Author and timestamp are already recorded on the commit object itself, independent of the message text, so a message adds nothing new there.
- D is wrong: A commit does not belong to a branch in a way the message would need to record; branch membership is just reachability from a movable pointer, unrelated to message content.

### 7.

A developer runs `git commit -m "Add retry to the upload path"` and immediately tells a colleague, "it's done, you should see it now." The colleague pulls and sees nothing new. What is missing from that claim, and which command block on this concept explains it?

- **A.** Nothing is missing; committing in Git publishes the change the same way it would in a centralized system such as Subversion, where the working copy and the server share one history.
- **B.** The commit message was too short for the colleague's client to notice a new commit arrived.
- **C.** The colleague needed to run `git fetch` twice before a single commit becomes visible.
- **D.** The commit only recorded a snapshot in the local repository; making it visible to a colleague requires the separate act of pushing it to a shared remote.

**Answer: D.** A commit is an immutable local snapshot; nothing leaves the machine it was made on until a push. That commit/push split is exactly what the "Not to be confused with: Commit vs Push" block on this concept exists to test — `git commit -m` records, push publishes, and only the second one needs a network.

- A is wrong: That is the centralized-tool model, where committing writes to the one shared history; in Git committing writes only to the author's own copy.
- B is wrong: Message length affects readability, not whether a commit is transmitted anywhere; a one-word message is committed and stays exactly as local as a long one.
- C is wrong: One fetch is enough to retrieve a commit that has actually reached the remote; the real issue here is that nothing was pushed yet, so no number of fetches would find it.

### 8.

A repository has commits on both `main` and an unmerged feature branch. From `main`, which command shows only the commits reachable from where you currently are, correctly omitting the feature branch's commits?

- **A.** `git log --all`, since only the `--all` flag limits output to the current branch
- **B.** `git status`, since it reports which branch is currently checked out along with its history
- **C.** `git diff main feature`, since comparing the two branches shows which commits are unique to each
- **D.** A bare `git log`, which walks the parent chain backwards from HEAD

**Answer: D.** Each commit carries a link to its parent (two parents for an ordinary merge commit, more for an octopus merge of several branches at once, and none for the very first commit), and `git log` walks that chain backwards from HEAD. A commit sitting only on another, unmerged branch is not on that path and so does not appear, which is a statement about reachability, not about the commit being lost.

- A is wrong: `--all` does the opposite of limiting: it shows commits reachable from every ref in the repository, including the feature branch this question wants excluded.
- B is wrong: `git status` reports the working tree, staging area and current branch name, not a list of commits — that is `git log`'s job.
- C is wrong: `git diff` reports line-level content differences between two endpoints, not a list of commit objects; it answers a different question than "what happened."

### 9.

A developer on a Git project loses network access on a train and continues committing, branching and reviewing `git log` for an hour before reconnecting. Why does none of that require the network?

- **A.** Git caches the last few commits locally so short offline sessions work, then reconciles with the server automatically on reconnect, discarding whatever the cache could not hold.
- **B.** A centralized system like Subversion works the same way, since the working copy also stores full history.
- **C.** Git is distributed: every clone holds the entire history, so committing, branching and reading the log are local operations.
- **D.** The developer's machine is temporarily acting as `origin` for the rest of the team.

**Answer: C.** In a distributed system, cloning copies the object database, not just the latest files, so the clone is a full peer that can operate offline. A centralized system keeps one authoritative server copy and needs a round trip for most operations — the architectural fact this whole competency keeps circling back to.

- A is wrong: There is no partial local cache to run out of — a clone holds the complete history from the start, not a rolling window of recent commits.
- B is wrong: The opposite is true of a centralized system: the working copy holds little or none of the history, and most operations need a round trip to the one authoritative server.
- D is wrong: Being a full peer copy is not the same as being the team's configured remote; `origin` is a name assigned by convention, and nothing here reassigns it.

### 10.

A developer wants to see what changed upstream before deciding what to do next, without disturbing the branch they are currently in the middle of editing. Which command fits, and why does the other one not?

- **A.** `git fetch`, which downloads commits and updates remote-tracking branches only, leaving the current branch, index and working tree untouched.
- **B.** `git pull` — it downloads commits the same way fetch does, so it is just as safe to run mid-edit without any risk of disturbing the branch currently checked out.
- **C.** `git pull --rebase` — rebasing is a gentler form of pull that never touches the working tree.
- **D.** `git remote -v`, since checking the configured URLs is the safest way to see upstream changes

**Answer: A.** Fetch cannot surprise you; pull can. `git fetch` downloads commits and updates remote-tracking branches, changing nothing about the current branch, index or working tree; `git pull` runs that same fetch and then immediately integrates the result. The documentation lists four integration options: `--ff-only`, which is the default and fails if the local branch has diverged, `--rebase`, `--no-rebase`, which merges, and `--squash`. Any of them touches the branch a mid-edit developer is standing on.

- B is wrong: Pull is fetch followed immediately by an integration step, which by default fast-forwards and fails outright if the branch has diverged, and merges or rebases when configured to — exactly the disturbance being avoided here.
- C is wrong: `git pull --rebase` is a rebase, with every history-rewriting consequence that carries; it is not gentler, and it can touch the working tree by replaying commits onto the fetched tip.
- D is wrong: Listing remote URLs shows configuration, not new commits; it does not retrieve anything from the server at all.

### 11.

A developer's local `main` is behind the remote's `main`, with no local commits of its own since the last sync. They run `git pull`. What happens, given that the histories have not actually diverged?

- **A.** The fetch retrieves the new commits, and the integration step fast-forwards `main` to match; there is no conflict and no merge commit, because there was nothing to diverge from.
- **B.** Pull always opens a merge conflict for review, even when nothing local has changed.
- **C.** Pull refuses to run at all unless `--rebase` or `--no-rebase` is specified up front on the command line, regardless of whether the two branches have actually diverged from one another.
- **D.** Only the remote-tracking branch updates; the local `main` stays behind until a separate `git merge` is run by hand.

**Answer: A.** `git pull` is fetch followed by an integration step. The documentation gives four options for that step and names `--ff-only` the default, so a branch that is merely behind fast-forwards with nothing specified. Only when the two histories have genuinely diverged does that default fail, at which point the developer chooses `--rebase`, `--no-rebase` or `--squash`, or sets `pull.rebase`, `pull.squash` or `pull.ff`.

- B is wrong: A conflict requires both sides to have changed the same region; with no local commits since the last sync there is nothing on this side to conflict with, so pull completes cleanly.
- C is wrong: Failure is specific to the diverged case: the documented default is `--ff-only`, which fails only when the local branch has diverged, so a branch that is merely behind fast-forwards with no flag at all.
- D is wrong: That describes what a bare `git fetch` would leave behind; `git pull` is precisely fetch plus the integration step, so it also moves the local branch here.

### 12.

A developer runs `git add .` to stage every change, then runs a bare `git diff` and it prints nothing. They conclude nothing changed. Are they right?

- **A.** Yes — `git diff` compares the working tree to the last commit, so empty output always means the files match HEAD exactly, whether or not anything was staged first with `git add` beforehand.
- **B.** No, but only because `git add .` silently failed to stage anything ignored by `.gitignore`
- **C.** Yes, because `git status` would have reported the same empty result if anything remained changed
- **D.** No: a bare `git diff` compares the working tree with the index, and staging moved the changes into the index; `git diff --staged` compares the index with HEAD and would show them.

**Answer: D.** Bare `git diff` compares the working tree with the index, showing what could still be staged; after `git add .` that difference is empty even though the index now differs from HEAD. `git diff --staged` (with `--cached` as a synonym) compares the index with HEAD instead, which is exactly what a commit right now would record.

- A is wrong: That describes `git diff <commit>` against a specific commit, not the bare form; bare `git diff` compares working tree to the index, a different pair of states entirely.
- B is wrong: Files matched by `.gitignore` being skipped is a real behaviour of `git add`, but it explains a partial stage, not why a bare `git diff` prints nothing for files that clearly were staged.
- C is wrong: `git status` would still list the staged files under "Changes to be committed"; it is `git diff` specifically, not `git status`, that goes quiet once everything is staged.

### 13.

A developer wants a compact, one-line-per-commit summary of recent history to scan quickly. Which command and option produces that?

- **A.** `git log --oneline`, shorthand for `--pretty=oneline --abbrev-commit`, printing one abbreviated hash and subject line per commit
- **B.** `git diff --stat`, since `--stat` produces a one-line-per-file summary
- **C.** `git status -s`, since the short form is described the same way as a condensed view and also prints one line per changed path in the repository.
- **D.** `git branch -a`, since listing every branch also lists their most recent commits

**Answer: A.** `git log` answers "what happened," walking parents backwards from HEAD so it lists only commits reachable from where you currently are; `--oneline` is shorthand for `--pretty=oneline --abbrev-commit`, giving one abbreviated hash and subject line per commit for quick scanning.

- B is wrong: `--stat` summarizes changed files in a diff, not commits in the history; it answers "what changed," not "what happened," and shows files, not commits.
- C is wrong: `git status -s` condenses the working tree and staging area's state into short codes; it says nothing about commit history at all.
- D is wrong: `git branch -a` lists branch names, local and remote-tracking; it does not print a scrollable per-commit history at all.

### 14.

A config file containing an API key was committed and pushed weeks ago. Someone notices and adds the file's name to `.gitignore` to fix it. Does that remove the key from the project's history?

- **A.** Yes — once a path is listed in `.gitignore`, Git removes it from every existing commit that mentions it, including copies already fetched into other collaborators' clones on other machines.
- **B.** Yes, but only after the next `git commit` is made, which silently prunes ignored paths from history
- **C.** No. `.gitignore` only affects files Git does not yet track; a file already committed keeps its history and stays in every clone taken since, so the credential must be rotated instead.
- **D.** No, and the fix is to run `git reset` on the repository to erase the file's history entirely

**Answer: C.** `.gitignore` specifies intentionally untracked files, and files already tracked by Git are not affected by it at all. Once a secret is committed and pushed, it is in the history and in every existing clone; the only reliable remediation is to treat the credential as compromised and rotate it, since the copies that already left cannot be recalled.

- A is wrong: This is the exact trap the concept warns about: `.gitignore` governs future tracking decisions, not past commits, so nothing in the existing history changes.
- B is wrong: No ordinary commit prunes prior history; committing again only records the current state going forward and leaves every earlier snapshot exactly as it was.
- D is wrong: The first half is right, but `git reset` only moves the current branch pointer and does not rewrite or erase commits other clones have already taken; it is not the remediation here.

### 15.

After checking out a specific commit hash directly instead of a branch name, `git status` reports "HEAD detached." What does that phrase mean HEAD is now pointing at?

- **A.** The single newest commit in the entire repository, regardless of which branch it is on
- **B.** The commit itself, directly by its hash, with no branch name carrying it forward as new commits are made.
- **C.** A newly created branch that Git names automatically after the detach
- **D.** The remote-tracking branch for `origin`, since detaching disconnects HEAD from the local branches only and reattaches it to the nearest remote-tracking ref instead.

**Answer: B.** HEAD is a pointer to whatever is currently checked out — normally the name of the current branch, which is why committing advances that branch. In detached-HEAD state it names a commit directly instead, with no branch to carry forward, which `git log HEAD` and a bare `git log` both display identically since HEAD is the default starting point either way.

- A is wrong: HEAD names where you currently are, not where the project is furthest along; it can point at any commit, including one far behind the tips of other branches.
- C is wrong: Detaching creates no branch at all; that is precisely what "detached" describes, and any commits made there belong to nothing until a branch is created.
- D is wrong: A remote-tracking branch is a separate local record of the remote's state; detaching HEAD has nothing to do with it and does not repoint it.

### 16.

A `git merge` stops mid-operation with conflict markers written into a file, and the developer edits the file, removing the markers and keeping the content they want. What is the correct next step to mark that file resolved?

- **A.** Run `git merge --abort` to accept the manual edit as the final state.
- **B.** Nothing further is needed, since deleting the conflict markers already resolves the conflict on its own.
- **C.** `git add` the edited file, then continue the merge — staging is what tells Git the conflict is settled.
- **D.** Re-clone the repository fresh and redo the edits, since a conflicted merge cannot be completed in place.

**Answer: C.** A merge conflict is Git declining to guess when both sides changed the same region of a file, so resolution is by definition manual: edit the file, stage it with `git add`, then finish with `git commit` or `git merge --continue`. Git never checks whether the staged content is a sensible merge — that correctness is entirely on the person resolving it.

- A is wrong: `--abort` throws the whole merge attempt away and returns to the pre-merge state; it does not keep the edit or complete anything.
- B is wrong: Git never validates a resolution and the file is still listed as unmerged until it is staged; removing markers alone leaves the path unresolved from Git's point of view.
- D is wrong: A conflicted merge is completed in place all the time; re-cloning discards the very work being resolved and is not how Git expects conflicts to be handled.

### 17.

In the middle of a conflicted merge, a developer runs `git diff` to understand what is in dispute. What does it show, compared to an ordinary `git diff` outside a conflict?

- **A.** The same working-tree-versus-index comparison it always shows, since a merge in progress does not change what `git diff` compares.
- **B.** Nothing, since `git diff` refuses to run at all while a merge is unresolved
- **C.** A combined three-way diff highlighting the changes from both the HEAD and MERGE_HEAD sides, rather than a normal two-sided patch.
- **D.** A list of every commit on both branches that contributed to the conflict

**Answer: C.** `git status` lists conflicted paths under "Unmerged paths" and states that staging with `git add` is how resolution is marked; `git diff` complements that by showing a combined three-way diff against HEAD and MERGE_HEAD during a conflict, rather than its ordinary working-tree-versus-index comparison.

- A is wrong: A conflict is a special case: `git diff` switches to a three-way combined diff against both merge parents instead of its usual working-tree-versus-index comparison.
- B is wrong: `git diff` works normally during a conflict; it is one of the two commands `git status` points to for understanding what needs resolving, alongside listing the unmerged paths.
- D is wrong: Listing commits is `git log`'s job, based on reachability from a ref; `git diff` reports line-level content differences, not a set of commit objects.

### 18.

`main` has not received any new commits since `feature/retry` branched off it. A developer runs `git merge feature/retry` while on `main`. What does the resulting history look like?

- **A.** A new merge commit appears with both branch tips as its parents, recording that the merge happened.
- **B.** The commits from `feature/retry` are replayed on top of `main` as new commits with new hashes.
- **C.** The `main` pointer simply advances to `feature/retry`'s tip, and no merge commit is created at all.
- **D.** Git refuses the merge and asks for a pull request to be opened instead.

**Answer: C.** "Merging always creates a merge commit" is false and is a plausible-sounding distractor precisely because it is true in the more visible, diverged case. When the current branch's tip is already an ancestor of the commit being merged, Git fast-forwards the pointer and creates no merge commit at all; `--no-ff` is the option that forces one anyway.

- A is wrong: That outcome only happens when the two histories have genuinely diverged; here `main` never moved, so there is nothing for a merge commit to combine.
- B is wrong: Replaying commits as new objects with new hashes is what `git rebase` does; `git merge` never rewrites existing commits, on a fast-forward or otherwise.
- D is wrong: A pull request is a hosting-platform review wrapper with no effect on local Git behaviour; `git merge` runs and completes locally regardless of whether one exists.

### 19.

A contributor says: "I merged my branch, so I opened a pull request, and then I rebased it once more to be sure." A reviewer points out that this sentence treats three different things as interchangeable steps in one workflow. Sort them correctly by what each actually is.

- **A.** All three are Git commands with slightly different flags but the same underlying effect on history.
- **B.** Merge is a Git command that joins two histories; a pull request is the hosting platform's review wrapper around a proposed merge, not a Git operation; rebase replays commits onto a new base, rewriting their hashes.
- **C.** Merge and pull request are both Git commands, and rebase is the platform-side review step.
- **D.** Rebase and pull request both rewrite commit hashes, while merge is the only one of the three that leaves history untouched on every kind of merge, fast-forward or diverged, run locally or triggered from a hosted review.

**Answer: B.** Merge and rebase are two Git operations for integrating work — merge preserves both histories and joins them with a merge commit when they diverged, rebase replays commits as new objects onto a different base. A pull request is not an integration operation at all; it is a platform's review wrapper placed around one, and git-scm.com does not define it because it is not a Git concept.

- A is wrong: A pull request has no Git command that opens one — `git request-pull` only prints a summary for a human to send — so it is not a Git operation at all, let alone one with the same effect as merge or rebase.
- C is wrong: Rebase runs entirely locally with `git rebase`; review and status checks are what actually happen on the platform, and a pull request is that platform layer, not merge's counterpart.
- D is wrong: A pull request changes no history at all — opening one only asks that a merge be performed later; rebase is the one that rewrites hashes, not the pull request.

### 20.

An exam-style question lists "pull request" alongside `git commit` and `git merge` as three Git operations to define. Which part of that framing is wrong?

- **A.** Nothing is wrong; all three are standard Git commands documented on git-scm.com with their own manual pages and option lists.
- **B.** `git merge` is the odd one out, since only commit and pull request happen without a network connection at all, and merge always requires contacting a remote server before it can complete, even when combining two purely local branches.
- **C.** `git commit` is the odd one out, because only merge and pull request combine two branches into a single resulting line of history.
- **D.** "Pull request" is not a Git operation at all; it is a hosting platform's concept, defined nowhere in git-scm.com's documentation, and its own primary source here is GitHub's own documentation rather than a Git manual page.

**Answer: D.** A pull request is a proposal, raised on a hosting platform rather than in Git, to merge one branch into another, and the place where review and automated checks attach before that merge happens. It is process, not mechanism: `git commit` and `git merge` both run locally with no platform involved, while a pull request has no Git command that opens one at all.

- A is wrong: `git commit` and `git merge` are documented Git commands; a pull request is a platform feature with no equivalent entry in Git's own manual pages.
- B is wrong: `git merge` runs locally with no network needed, same as `git commit`; a pull request is the one requiring the platform, which is the actual odd one out.
- C is wrong: A pull request does not itself combine anything — it only proposes a merge that a human or the platform performs later — so it does not share that property with `git merge`.

### 21.

A contributor's pull request receives review comments asking for changes. What is the usual way to address them, and what is the usual mistake?

- **A.** Close the request, run `git merge` locally to apply the reviewer's suggestions by hand, then push the merged result as a brand-new commit for the platform to pick up.
- **B.** Push further commits to the same source branch, which updates the existing open request; opening a second pull request to "fix" the first is the usual mistake.
- **C.** Rebase the branch onto `main` and force-push it, since only a rewritten branch is eligible to receive further review comments.
- **D.** Open a second pull request from the same branch, since each round of review comments needs its own request

**Answer: B.** A pull request is the place where review comments and automated checks attach to a proposed merge; pushing further commits to the source branch is typically how those comments get addressed, since it updates the same open request rather than requiring a new one. Merging is generally then carried out by the platform, using whichever strategy the project has configured.

- A is wrong: There is nothing to merge locally at this stage — the branch is still unreviewed and unmerged — and closing the request throws away the review already in progress for no reason.
- C is wrong: Ordinary commits pushed to the source branch are enough to update the request; rebasing is a separate, riskier choice that is not required just to address review feedback.
- D is wrong: This is exactly the wrong reflex the concept warns about: pushing further commits to the source branch is what updates an open request, not opening another one.

### 22.

Using the block that separates recording from publishing, place `git commit` and `git push` on the correct sides of that line.

- **A.** Both commands require a network, since Git needs to contact the remote to compute a commit's hash.
- **B.** `git commit` uploads to the remote, and `git push` only updates the local branch pointer.
- **C.** Neither can be refused by the other side; both always succeed once the local repository accepts them, regardless of what state the remote branch, its full commit history, or its configured upstream tracking reference happen to be in at that particular moment.
- **D.** `git commit` records the staged content in the local repository, needing no network and visible only to the author; `git push` uploads those commits to a remote branch, needing a network and becoming visible to anyone with access.

**Answer: D.** Committing only records a snapshot in the local repository; nothing reaches the remote until a push. The commit/push split is the single most common misconception carried in from centralized tools, where committing itself publishes to the one shared history — Git keeps the two acts separate and only the second one needs a network.

- A is wrong: A commit's hash is computed entirely from local content and the parent it points at; no remote is contacted to produce it, and `git commit` runs the same with or without network access.
- B is wrong: That reverses the two roles: uploading to a remote branch is what `git push` does, while `git commit` only ever moves the local branch pointer, in the local repository.
- C is wrong: A push can be refused as a non-fast-forward update when the remote holds commits it would otherwise discard; a local commit has no equivalent remote-side rejection to worry about.

### 23.

A developer runs `git push -u origin main` for the first time on a new branch, then later runs a bare `git push` and it is rejected as a non-fast-forward update. What does `-u` add, and what does the rejection mean?

- **A.** `-u` uploads the branch's tags along with its commits; the rejection means the developer lacks write permission on the remote.
- **B.** `-u` forces the push through even if the remote has diverged; the rejection cannot happen again on this branch afterward.
- **C.** `-u` is required only the very first time any repository pushes to that remote at all; the rejection here means the branch name collides with an existing one on the server that a different contributor already created earlier that day.
- **D.** `-u` records `origin main` as the branch's upstream so a bare push resolves the same destination; the rejection means the remote holds commits that are not ancestors of what is being sent, so applying it would discard them.

**Answer: D.** `git push -u origin main` both pushes and sets that upstream, letting a later bare `git push` know where to send it. Separately, the remote refuses any update where its current commit is not an ancestor of what is being sent, because applying it would discard commits the remote already has — the documented explanation is that a rejected push also happens in a repository nobody else pushes to, whenever a commit already sent is amended or rebased.

- A is wrong: Tags are never pushed by a plain push regardless of `-u` — they need `--tags`, `--follow-tags`, or being named directly — and a non-fast-forward rejection is usually not a permissions problem at all.
- B is wrong: That describes `--force`, a different flag with the opposite intent of `-u`; a later push can still be rejected as a non-fast-forward if the remote moves again.
- C is wrong: `-u` is about setting this branch's own upstream, unrelated to whether anyone else has pushed to the remote before; the rejection is about commit ancestry, not a name collision.

### 24.

A developer runs `git rebase main` on a feature branch. Afterward, the commits look identical in content to before. Are they the same commit objects Git had a moment ago?

- **A.** Yes — rebase only changes where the existing commit objects sit in history, leaving their hashes untouched the same way moving a branch pointer forward during a fast-forward merge does.
- **B.** Yes, because rebase and merge both preserve every original commit's hash by design.
- **C.** No. Each is replayed as a new commit with a new hash, even though the resulting content looks the same as if the work had started from the current `main` all along.
- **D.** No, because `git reset --hard` deleted the originals and nothing new was created to replace them

**Answer: C.** `git rebase` (here as `git rebase main`) lists the commits on the current branch that have no equivalent in `main`, checks out `main` with the equivalent of `git checkout --detach`, replays those commits one by one in a way the documentation likens to `git cherry-pick`, and then repoints the branch at the final replayed commit. The documentation's own diagram writes the results as `A'--B'--C'` rather than `A--B--C`. That rewriting property is the entire crux of why rebasing a branch other people have already pulled is discouraged: their repositories still hold the discarded originals.

- A is wrong: That describes what a rebase looks like from the outside, but the mechanism is replacement: the original commits are discarded and new ones with new hashes are manufactured in their place.
- B is wrong: Preserving original hashes is what merge does; rebase is defined by the opposite property — replacing commits with replayed ones — which is the whole reason it produces linear history.
- D is wrong: The current documentation describes a rebase as checking out the upstream detached and then replaying the saved commits one by one, similar to `git cherry-pick`, so replacements are created rather than nothing.

### 25.

A developer pushed `feature/retry` yesterday, and a colleague has already pulled it and started building on top. The developer now wants a cleaner, linear history before merging. Which choice is safe, and which is not?

- **A.** Rebasing is unsafe here, because the colleague's clone still holds the original commits, and rewriting them would make the histories diverge even though the content is identical.
- **B.** Rebasing is safe as long as the developer includes a clear commit message explaining the rewrite.
- **C.** Rebasing is safe because `git push` will simply merge the two histories back together automatically.
- **D.** Rebasing is unsafe only if the colleague has also committed new work on top of the original commits; a colleague who merely pulled without committing anything further is unaffected either way.

**Answer: A.** Rebase does not undo anything and does not resolve a conflict by itself; it changes where commits sit in history by replacing them, which is exactly what separates it from revert and reset. That replacement is why rebasing a branch other people have already pulled is discouraged: the colleague's repository still contains the discarded originals, so the two histories have diverged even with identical content.

- B is wrong: A message describes intent but does not change the mechanics: the colleague's repository still contains commits that no longer exist upstream, regardless of how the rewrite is explained.
- C is wrong: A plain push refuses this exact situation as a non-fast-forward rejection, because the remote holds commits that are no longer ancestors of the rewritten branch; nothing merges automatically.
- D is wrong: Divergence happens the moment the colleague's repository holds the pre-rebase commits at all; whether they have since added their own commits changes how painful reconciling is, not whether the histories diverged.

### 26.

A repository has a remote-tracking branch `origin/main` reporting that the local branch is four commits behind. Does that reading describe the remote server right now?

- **A.** Yes — `origin/main` is a live view of the server, updated automatically whenever the server changes.
- **B.** No, because `origin/main` is a local, read-only record of where the remote's `main` stood at the last fetch, pull or push, so the server may have moved further since.
- **C.** Yes, because `origin` always refers to the authoritative repository, which every collaborator's client is expected to keep synchronized with in real time as part of the workflow.
- **D.** It depends on whether the branch has an upstream configured with `git push -u`.

**Answer: B.** A remote is a short name bound to a URL, and `origin/main` is a remote-tracking branch: a local record of where the remote's branch stood the last time this repository communicated with it. Those records update on fetch, pull and push and nowhere else, so a report of being "behind" describes the last contact, not the server at this instant.

- A is wrong: There is no automatic update channel; `origin/main` only changes when this repository performs a fetch, pull or push, so it can be stale without anything being wrong.
- C is wrong: `origin` carries no special technical authority; it is simply the conventional name `git clone` assigns, and nothing keeps it synchronized without an explicit network operation.
- D is wrong: Setting an upstream affects where a bare `git push` or `git pull` goes; it does not change how or when the remote-tracking branch itself is refreshed.

### 27.

A repository has two remotes configured, `origin` and `upstream`, and a developer wants to see both names next to the URLs they push and fetch from. Which command shows that?

- **A.** `git remote -v`, with `-v` placed between `remote` and any subcommand
- **B.** `git branch -a`, since it lists both local and remote-tracking branches
- **C.** `git log --all --remotes`, since it walks history across every remote-tracking ref
- **D.** `git remote -v`, with `-v` placed after `origin` to scope it to that one remote

**Answer: A.** A remote is a short name bound to the URL of another copy of the repository, and `git remote -v` lists every configured remote with its fetch and push URLs. `origin` is not a keyword; it is simply the name `git clone` assigns to the repository it cloned from, and additional remotes such as `upstream` are added the same way any other one is.

- B is wrong: That lists branch names, including remote-tracking ones, but not the remote names and their configured URLs, which is a different piece of configuration.
- C is wrong: That shows commits reachable from remote-tracking refs, not the remote names and URLs behind those refs.
- D is wrong: The documentation is explicit that `-v` must sit between `remote` and any subcommand; it is a flag on `remote` itself and does not take a remote name as an argument this way.

### 28.

A new project directory exists with no version history yet, and no other copy of it exists anywhere to copy from. Which command starts tracking it under Git?

- **A.** `git clone` pointed at the directory itself, to bring it under version control
- **B.** `git add` on every file, since staging is what begins tracking a project
- **C.** `git init`, run inside the directory, to create an empty `.git` directory with no commits and no remote
- **D.** Creating a remote repository on a hosting platform first, then pulling it down locally with `git clone` once the platform has finished provisioning it

**Answer: C.** `git init` creates an empty repository — a `.git` directory with an object store and an initial branch carrying no commits — and configures no remote, which fits a directory with nothing to copy from. `git clone` is the other repository-creating command, but it requires an existing source and copies its history rather than starting fresh.

- A is wrong: Clone needs an existing source repository to copy history from and configures a remote for it; there is nothing here yet to clone.
- B is wrong: Adding stages the content of files already inside a repository; it does not create the `.git` directory that makes tracking possible in the first place.
- D is wrong: A remote is optional and unrelated to whether a local `.git` directory exists; a project can be a complete repository with no remote configured at all.

### 29.

A colleague copies a teammate's project folder over the network, but deliberately skips the hidden `.git` directory because it "just holds settings." What did the copy actually lose?

- **A.** Every commit, branch and tag, since the repository itself lives entirely inside `.git`, leaving only the checked-out files behind.
- **B.** Only the remote URL, since `git remote -v` reads its output from `.git/config`.
- **C.** Nothing important, since running `git clone` again later can regenerate `.git` from the working files as long as the directory structure is unchanged
- **D.** Only the `.gitignore` patterns, since those are the settings the colleague meant to skip

**Answer: A.** The `.git` directory is where every commit, branch ref and tag physically lives; the project files beside it are a checked-out view, not the history itself. Deleting or skipping `.git` leaves the files intact and destroys the repository, which is a different loss from losing files.

- B is wrong: The remote configuration is one small piece of what `.git` holds; the far larger loss is the entire commit history, which also lives there.
- C is wrong: `git clone` needs an existing source repository to copy from; the working files alone carry no history for it to reconstruct.
- D is wrong: `.gitignore` is an ordinary tracked file that lives in the working tree, not inside `.git`, so skipping `.git` does not affect it at all.

### 30.

A bad commit was pushed yesterday and two colleagues have already pulled it. The block comparing this concept to rebase makes the same point twice about shared branches — which undo command is safe here, and which Git operation shares its unsafe property?

- **A.** `git reset --hard` is safe, since it removes the bad commit outright rather than leaving a visible trace of the mistake for reviewers, auditors, or the release notes to ever find later on down the line.
- **B.** Both `git revert` and `git reset` are equally safe here, since both are described as ways to undo a commit.
- **C.** `git revert` is safe, and merge shares the same unsafe rewriting property as reset on a shared branch.
- **D.** `git revert` is safe, as it adds a new commit undoing the old one and leaves the original in place; rebase shares reset's unsafe property of rewriting history that others have already pulled.

**Answer: D.** `git revert <commit>` records a new commit applying the inverse of an existing one, leaving the original in place, so history grows and nothing is rewritten — safe on a branch others already have. `git reset` moves the branch pointer, and `git rebase` replays commits as new objects; both rewrite history, which is why rebasing or resetting a branch that colleagues have already pulled forces them to reconcile diverged histories.

- A is wrong: Removing the commit outright is exactly the problem: the next push is rejected as a non-fast-forward, and forcing it takes commits away from the colleagues who already pulled.
- B is wrong: They share a goal but not a mechanism: revert keeps the original commit and adds an inverse, while reset drops commits off the branch by rewriting where it points.
- C is wrong: Merge never rewrites existing commits, on a fast-forward or a diverged merge alike, which is exactly what makes merge safe on shared branches and rebase not.

### 31.

A developer has three local, unpushed commits they want to undo, and wants the changes to remain in the working tree as unstaged edits so they can be reworked. Which `git reset` mode fits, versus the other two?

- **A.** `--soft`, since it always leaves the fewest changes behind of the three modes
- **B.** `--mixed`, the default, which resets the index but leaves the working tree alone, so the undone changes remain as unstaged edits ready to rework.
- **C.** `--hard`, since it is the mode most commonly reached for when reworking a change
- **D.** `git revert` run three times in a row, once per commit, since it also leaves the working tree unstaged and requires the same manual staging step reset does.

**Answer: B.** Reset's three common modes differ only in how far the change propagates: `--soft` moves HEAD and leaves index and working tree alone, so changes remain staged; `--mixed`, the default, resets the index but not the working tree, leaving unstaged edits; `--hard` resets both together, discarding tracked changes since that commit with no commit left to recover them from.

- A is wrong: `--soft` moves HEAD and leaves both the index and working tree alone, so the undone changes stay staged rather than becoming unstaged edits.
- C is wrong: `--hard` resets the index and working tree together, discarding the tracked changes entirely — with no commit holding them, there is nothing left to rework.
- D is wrong: `git revert` commits its result by default rather than leaving anything unstaged, and it adds inverse commits instead of moving the branch pointer, which is a different operation from reset entirely.

### 32.

A developer has uncommitted edits and needs to switch branches to handle an urgent request, without committing half-finished work. They run `git stash`. Where does that work go, and does a colleague running `git log` on the shared remote see it?

- **A.** It becomes a regular commit on the current branch, so a colleague sees it the next time they pull.
- **B.** It is discarded permanently the moment `git stash` runs, freeing the working tree for the urgent branch switch with nothing left to restore afterward.
- **C.** It is set aside under `refs/stash`, belonging to no branch and never pushed to any remote, so a colleague running `git log` sees nothing of it.
- **D.** It is written into `.gitignore` as an untracked change so it is skipped on the next commit

**Answer: C.** `git stash` records the current working-tree and index changes, then reverts the working directory to match HEAD, so the developer can switch context with a clean tree and restore the work later with `git stash pop`. It sits in `refs/stash`, belongs to no branch, is never pushed to a remote, and is invisible to `git log`.

- A is wrong: A stash is deliberately not a commit on any branch; treating it as one is the exact mistake the concept warns about — "stash it so the team can see it" is always wrong.
- B is wrong: The point of stashing is to preserve the work, not discard it — it can be restored later with `git stash pop` once the urgent task is finished.
- D is wrong: `.gitignore` is a pattern file for untracked paths and has nothing to do with where stashed changes are stored.

### 33.

A team wants to mark the exact commit shipped as version 1.4.0, in a way that will not move even as new commits land on `main` afterward. Should they use a branch or a tag, and why?

- **A.** A branch, since only branches can be checked out later to inspect what shipped
- **B.** A tag, since committing advances a branch but leaves every tag exactly where it was, making a tag the fixed marker this needs.
- **C.** Either works identically, since both a branch and a tag are just names pointing at a commit
- **D.** A branch, because a `git stash` entry can be attached to it later to record the release notes once the team decides what belongs in that release.

**Answer: B.** A tag is a fixed label on one commit, conventionally used to mark a release; the defining contrast with a branch is that a tag does not move, while committing advances a branch and leaves every tag exactly where it was. `git tag -a v1.4.0 -m "Release 1.4.0"` creates an annotated tag, the form the documentation describes as meant for releases.

- A is wrong: A tag can be checked out too, into detached HEAD; the real reason to prefer a tag here is that it stays fixed, while a branch would keep moving as `main` gains commits.
- C is wrong: They are both names pointing at a commit, which is exactly what makes them interchangeable-looking, but only a tag is guaranteed not to move as new commits are made.
- D is wrong: A stash holds uncommitted working-tree changes and has nothing to do with recording release notes on a branch or tag.

### 34.

A team wants a release tag that records who tagged it, when, and a message — not just a bare reference to the commit. Which form of `git tag` produces that?

- **A.** An annotated tag, created with `-a` (or implied by supplying `-m` alone), which is a real object in the database carrying the tagger's name, email, date and message.
- **B.** A lightweight tag, created with plain `git tag <name>` and no other options
- **C.** A remote-tracking tag, since only tags fetched from a remote carry tagger metadata
- **D.** Any tag pushed with `--follow-tags`, since pushing is what attaches tagger metadata to it retroactively, even to a tag that was originally created as lightweight and carried none.

**Answer: A.** `git tag <name>` creates a lightweight tag, a bare reference with no metadata; `git tag -a <name> -m "<message>"` creates an annotated tag, a real database object carrying the tagger's name and email, a creation date, a message and optionally a signature — and per the documentation, supplying `-m` without `-a`, `-s` or `-u` implies `-a`.

- B is wrong: A lightweight tag is a bare reference to an object with no metadata of its own; the documentation describes it as meant for private or temporary labels, not releases needing a recorded tagger and message.
- C is wrong: There is no separate "remote-tracking tag" category with different metadata rules; whether a tag carries a tagger, date and message is decided by lightweight versus annotated, not by its origin.
- D is wrong: `--follow-tags` only controls whether a push also sends annotated tags reachable from what is being pushed; it does not create or add metadata to a tag that lacks it.

### 35.

A five-person team keeps its infrastructure-as-code in Git and separately runs a nightly `tar` archive of the same server to an offsite host. Someone asks why both exist, since Git already keeps every version of the code. What is the accurate answer?

- **A.** Git records author-initiated snapshots of files someone is actively editing; the nightly archive is a scheduled, independent copy meant to let the whole server be restored after loss.
- **B.** Git already backs up the whole server, so the nightly archive is redundant and can be dropped once everyone trusts the repository and code review to catch mistakes before they ever reach production.
- **C.** Switching the team to a centralized system like Subversion would let one server hold both roles at once.
- **D.** Routing server changes through a change-management approval step would make the archive unnecessary.

**Answer: A.** Version control, backup and change management all produce evidence of "what changed," which is why a scenario can present all three as plausible. Version control recovers author-chosen revisions of actively edited files; backup, taken here with a scheduled `tar` archive, recovers from loss of the whole system; change management records approvals, not file contents.

- B is wrong: Git only records what someone deliberately committed, not the rest of the disk, and it carries no RPO/RTO guarantee for a lost machine.
- C is wrong: Centralized versus distributed is an architecture choice orthogonal to this gap; neither kind of version control system is a scheduled disaster-recovery backup.
- D is wrong: Change management governs who approved a production change, not how to recover files after a disk is lost.

### 36.

A configuration file was edited incorrectly three days ago and nobody noticed until today. The team wants to recover exactly what that one file looked like on the day before the mistake. What kind of system provides that?

- **A.** An independent backup taken on a schedule, since it is measured in RPO and RTO rather than per-file revisions and restores the whole system to one point in time, not a single document.
- **B.** A RAID array on the server, since it protects the data the file is stored on.
- **C.** Version control, which retains prior revisions of files under active change, each attributable to an author and a timestamp.
- **D.** A change-management ticket describing who approved the edit.

**Answer: C.** Version control exists precisely to let any earlier state of a tracked file be recovered, with the author and reason attached. Git is one implementation of this practice; recovering one file's content as of a given day is a version-control operation, not a backup restore or a RAID rebuild.

- A is wrong: A scheduled backup restores a point-in-time copy of a system; it exists to survive loss, not to hand back one prior revision of one file among many still-current ones.
- B is wrong: RAID survives the loss of a disk; it has no concept of an earlier revision and would have faithfully written the mistaken edit too.
- D is wrong: A ticket records that an approval happened; it does not itself hold the file's earlier content.

### 37.

A developer edits `config.yml`, runs `git add config.yml`, then edits `config.yml` again before running `git status`. Under which heading does `git status` list the file, and why?

- **A.** Under both "Changes to be committed" and "Changes not staged for commit", listing the staged content from the first edit and the later edit as unstaged.
- **B.** Only "Changes to be committed", since staging a file keeps tracking every edit made to it afterward
- **C.** Only "Untracked files", since the second edit effectively resets the file's tracking state
- **D.** Neither heading, because `git status` only reports differences since the last commit, not since the last `add`, so a re-edited staged file would be invisible to it entirely

**Answer: A.** `git status` reports the working tree, the staging area and the repository in plain words: "Changes to be committed" is the index, "Changes not staged for commit" is the working tree, and "Untracked files" are paths Git has never seen. `git add` copies a file's content as it is at that instant, which is why editing again afterward leaves that file listed under both of the first two headings at once.

- B is wrong: `git add` snapshots content at that instant rather than registering the file for continuous tracking, so later edits are not automatically folded in.
- C is wrong: Untracked means Git has never been told about the path at all; this file was already staged once, so it cannot fall back to untracked by being edited again.
- D is wrong: `git status` compares all three states against each other — working tree, index and HEAD — so a staged-then-re-edited file shows up under both headings at once.

### 38.

A developer edits two tracked files and creates one brand-new file, then runs `git commit -a -m "Update config"`. Which files end up in the new commit?

- **A.** All three files, since `-a` is defined to stage every change in the working directory, tracked or not, before the commit is created
- **B.** None of them, because `git commit -a` requires a prior `git add` for every file named in the commit, including files that were never tracked before this session began.
- **C.** Just the new file, since `-a` is meant to catch anything not yet under version control
- **D.** Only the two edited tracked files, because `-a` auto-stages modifications and deletions of files Git already tracks and never adds a new untracked file.

**Answer: D.** `git commit -a` auto-stages modifications and deletions of already-tracked files as part of committing, but it never adds a file Git has never seen — that still needs an explicit `git add`. A commit records exactly what the index holds at the moment `git commit` runs, nothing else.

- A is wrong: This is the exact trap `-a` sets: it auto-stages tracked-file changes only, so a genuinely new file needs `git add` before it is ever committed.
- B is wrong: That is backwards: `-a` exists specifically to skip `git add` for files Git already tracks, and it does stage and commit their changes.
- C is wrong: `-a` has the opposite scope: it only ever touches paths Git already tracks, and a new file is by definition not one of those.

