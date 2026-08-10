# Open Source Software and Licensing

Open Source Software and Licensing is the licensing and community half of IT Project
Management Fundamentals, the domain carrying 10% of the exam — 6th largest of 6 domains —
under the current (2025-09-16) blueprint, and its objective was **reworded** in the 2025
update. LFS200 barely reaches it: 1 FULLY COVERED, 15 NOT COVERED, 3 MENTIONED ONLY,
3 PARTIALLY COVERED — 7/22 (32%) are not NOT COVERED, and all seven it touches at all trace
to a single lesson (`research/lfs200-notes/00-course-map.md`). Nine of the 22 concepts are
depth 1, more than in any other file in this guide, so most of this material is a Quick
reference row rather than a topic: for those, recognising the term and its one trap is the
whole requirement. Everything below states what licence texts and the Open Source Definition
actually require, cited to those documents; none of it is legal advice, and the exam tests
what a licence says, not what a candidate should decide to do about it.

<a id="s-open-source-software-and-licensing-fundamentals"></a>
## Fundamentals

<a id="c-pm.open-source-software-and-licensing.open-source-software"></a>
### Open source software
*id: `pm.open-source-software-and-licensing.open-source-software` · depth 3 · importance 1 · LFS200: FULLY COVERED · sources: osi-osd*

**What it is** Software whose distribution terms grant every recipient the source code and
the rights to use, study, modify, and redistribute it. It is a property of the licence, not
of the code, the price, or the development process: the Open Source Definition (OSD) lists
ten criteria a licence must satisfy, and a licence either meets them or does not.

**Why it matters** The commonest question shape here describes a licence or a distribution
arrangement and asks whether it is open source. Two of the OSD's criteria decide most such
questions: free redistribution without a required royalty (OSD 1) and permission to make and
distribute derived works (OSD 3). A third, no discrimination against fields of endeavour
(OSD 6), disqualifies the most plausible-looking distractor of all — a licence that publishes
source but forbids commercial or competing use.

**How it works** The OSD requires, among its ten criteria, that source be included or
obtainable at no more than reasonable reproduction cost and be "the preferred form in which a
programmer would modify the program" (deliberately obfuscated source and intermediate output
do not count); that modifications and derived works be permitted; that the licence not
discriminate against persons, groups, or fields of endeavour; that the rights travel to
everyone the software is redistributed to without signing anything additional; and that the
licence not be specific to one product or one technology. The OSD was originally derived from
the Debian Free Software Guidelines.

**Key terms** Open Source Definition; derived works; free redistribution; field of endeavour;
source-available.

**Traps** "Open source" is not "you can see the code." A source-available licence — source
published, but production or competing commercial use restricted — fails OSD 6 and is not
open source, however visible the repository. Nor does open source mean free of charge: OSD 1
forbids a licence from *requiring* a royalty, and explicitly permits selling the software as
part of an aggregate distribution. Charging money for open source software is allowed; taking
away the recipient's redistribution rights is not.

**What the exam may test** Given a described licence — no commercial use, no modification,
source visible but redistribution barred, or free of charge but binary-only — deciding
whether it qualifies as open source, and naming which criterion it fails.

*Not to be confused with [free software and FOSS](open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.free-software-and-foss).*

<a id="cmp-pm.open-source-software-and-licensing.open-source-software"></a>
#### Not to be confused with: Open source software vs Proprietary software
*compares: `pm.open-source-software-and-licensing.open-source-software`, `pm.open-source-software-and-licensing.proprietary-software`*

| | Open source software | Proprietary software |
| --- | --- | --- |
| Source code to recipients | Required, in the preferred form for modification | Withheld, or shown under terms that bar reuse |
| Right to modify and redistribute | Granted to every recipient by the licence | Reserved to the vendor |
| Price | Unrelated — may be sold, and often is | Unrelated — may be zero-cost freeware |
| Who sets the terms | A licence that meets the OSD, applied by the copyright holder | The vendor, in terms of its own choosing (typically an EULA) |
| Rights on redistribution | Travel automatically to the next recipient, no extra agreement | Do not travel; redistribution is usually forbidden outright |

The separating axis is what the licence grants the recipient, not what the vendor charges or
whether the code is visible: open source grants use, modification, and redistribution to
everyone who receives it; proprietary reserves them.

<a id="c-pm.open-source-software-and-licensing.free-software-and-foss"></a>
### Free software and FOSS
*id: `pm.open-source-software-and-licensing.free-software-and-foss` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: gnu-free-sw*

**What it is** The Free Software Foundation's framing of the same body of software, defined
by four freedoms rather than by ten distribution criteria: freedom 0, to run the program as
you wish, for any purpose; freedom 1, to study how it works and change it (access to source
is a precondition); freedom 2, to redistribute copies; freedom 3, to distribute your modified
versions. FOSS (or FLOSS) is the deliberately neutral umbrella term for both camps at once.

**Why it matters** The word "free" in "free software" is about liberty, not price — free as
in free speech, not as in free beer. This is the single most reliably tested sentence in the
competency, because the price reading is the obvious wrong answer and every candidate has
heard the phrase informally.

**How it works** In practice the FSF and the Open Source Initiative bless nearly the same set
of licences; the two lists are maintained separately by different bodies against different
texts, so they overlap heavily rather than matching item for item. The difference that
actually shows up in exam wording is framing: the FSF argues from user freedom as an ethical
position, while "open source" was coined to argue the same licences on development and
business grounds. FOSS exists precisely so a sentence can name both without taking a side.

**Key terms** four freedoms (0 to 3); free as in freedom; FOSS; FLOSS; Free Software
Foundation.

**Traps** Free software may be sold, and selling it violates nothing — the freedoms concern
what the recipient may then do, not what the seller charged. Conversely, zero-cost software
is not free software if it withholds source or forbids modification: freeware is a price,
free software is a set of rights. "Free software" and "open source software" are also not
opposites; they are two descriptions that land on almost the same set of licences.

**What the exam may test** Distinguishing the freedom reading from the price reading of
"free," and recognising FOSS as the neutral umbrella rather than a third category of
software.

<a id="cmp-pm.open-source-software-and-licensing.free-software-and-foss"></a>
#### Not to be confused with: Free software and FOSS vs Open source software
*compares: `pm.open-source-software-and-licensing.free-software-and-foss`, `pm.open-source-software-and-licensing.open-source-software`*

| | Free software and FOSS | Open source software |
| --- | --- | --- |
| Defining document | The Free Software Definition's four freedoms (0 to 3) | The Open Source Definition's ten criteria |
| Who maintains it | The Free Software Foundation | The Open Source Initiative |
| Primary argument | User freedom, stated as an ethical position | Licence terms judged on practical and development grounds |
| What "free" means | Freedom, never price — selling copies is permitted | Not part of the term at all; price is likewise unrestricted |
| Licences covered | Nearly the same set, judged against a different text | Nearly the same set, judged against a different text |

The separating axis is the framing and the document doing the judging, not the software: the
two definitions were written by different organisations to argue different cases, and land on
almost the same licences.

<a id="c-pm.open-source-software-and-licensing.proprietary-software"></a>
### Proprietary software
*id: `pm.open-source-software-and-licensing.proprietary-software` · depth 3 · importance 1 · LFS200: MENTIONED ONLY · sources: osi-osd, gnu-free-sw*

**What it is** Software distributed under terms the vendor sets, which withhold some
combination of source code, the right to modify, and the right to redistribute. The usual
instrument is an end-user licence agreement granting a limited right to use a copy while
reserving everything else.

**Why it matters** Proprietary is the default alternative in every "which of these is open
source" question, and the distractors are built out of the two dimensions people wrongly
believe define it: price and visibility of source. Neither does.

**How it works** Copyright law reserves all rights to the author by default; an open source
licence gives specific ones away, and a proprietary licence gives away only the right to run
a copy under stated conditions. Everything else — modifying, decompiling, redistributing,
sublicensing — stays reserved. Zero-cost proprietary software (freeware, shareware,
"community editions") is common, and so is source-available proprietary software, where the
code is published for inspection but the licence bars redistribution or competing use.

**Key terms** EULA; source-available; freeware; all rights reserved; vendor terms.

**Traps** "Proprietary" is not a synonym for "paid," and "commercial" is not a synonym for
"proprietary": open source software is sold commercially, with support and certification, all
the time. It is also not a synonym for "closed source" in the strict sense — publishing the
source changes nothing if the licence still forbids redistribution and modification, which is
exactly what makes source-available licences a favoured distractor.

**What the exam may test** Classifying described products — freeware, a source-available
release with a no-competing-service clause, a commercially supported distribution of open
source software — as proprietary or open source on the licence terms rather than on price or
code visibility.

*Not to be confused with [open source software](open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.open-source-software).*

<a id="c-pm.open-source-software-and-licensing.source-code-and-binaries"></a>
### Source code and binaries
*id: `pm.open-source-software-and-licensing.source-code-and-binaries` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: osi-osd, gnu-gpl-faq*

**What it is** Source code is the human-readable form a programmer edits; a binary (object
code, an executable, a compiled library) is the machine form produced from it. The
distinction is a licensing one as much as a technical one, because several licences attach
obligations specifically to distributing the binary form.

**Why it matters** The obligation that most often surprises a candidate is triggered by
shipping a binary, not by writing code: under the GPL, conveying object code obliges the
distributor to make the Corresponding Source available to the recipients, which is why
"binary-only distribution of a GPL program" is a compliance failure rather than a normal
option.

**How it works** The OSD requires that source be included or obtainable for no more than a
reasonable reproduction cost, and that it be the preferred form in which a programmer would
modify the program — deliberately obfuscated source, or the output of a preprocessor or
translator, does not satisfy it. The GPL's Corresponding Source goes further than the bare
program text: it covers the scripts and interface definition files needed to build and
install the work. Permissive licences impose no such source obligation at all; they require
only that notices be carried along with whatever form is shipped.

**Key terms** object code; Corresponding Source; preferred form for modification; binary-only
distribution.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.open-source-software-and-licensing.open-source-initiative-and-the-open-source-definition` | Open Source Initiative and the Open Source Definition | The OSI stewards the ten-criterion Open Source Definition and runs the review process behind the approved-licence list. | The OSI approves licences, not projects: software is open source because its licence is on that list, not because a vendor says so. |

#### Scenario

A vendor publishes a product's full source on a public repository under a licence that
forbids offering the software as a hosted service and forbids redistribution of modified
copies, and markets it as open source. Work it out against the definition rather than the
marketing: source visibility satisfies nothing on its own, the no-hosted-service clause
restricts a field of endeavour, and the bar on distributing modified copies removes derived
works, so the licence fails the Open Source Definition and the product is proprietary
despite the published code. A second vendor charges a subscription for a distribution of
genuinely open source components; that is open source and commercial at once, since the
definition constrains the rights passed to recipients, not the price. Asked which of the two
ships "free software," the answer is the second, on freedoms rather than cost.

#### Knowledge check

1. What is the one-sentence difference between open source software and proprietary software?
   Open source grants every recipient source access plus the rights to modify and
   redistribute; proprietary reserves those rights to the vendor.
2. A licence publishes source but forbids use by competing service providers. Which Open
   Source Definition criterion does it fail?
   No discrimination against fields of endeavour (OSD 6) — and the product is source-available
   proprietary software, not open source.
3. "Free software" — free of what?
   Free as in freedom, not price: the four freedoms to run, study and change, redistribute,
   and distribute modified versions. Selling copies is permitted.
4. Is zero-cost software automatically free software or open source?
   No. Freeware is a price with proprietary terms; the definitions concern rights, not cost.
5. Why is binary-only distribution a problem under the GPL but not under MIT?
   The GPL obliges a distributor of object code to make the Corresponding Source available to
   recipients; permissive licences impose no source obligation, only notice retention.
6. Does the Open Source Initiative certify projects or licences?
   Licences. A project is open source because the licence it uses is OSI-approved.

<a id="s-open-source-software-and-licensing-license-families"></a>
## License families

<a id="c-pm.open-source-software-and-licensing.permissive-licenses"></a>
### Permissive licenses
*id: `pm.open-source-software-and-licensing.permissive-licenses` · depth 3 · importance 1 · LFS200: PARTIALLY COVERED · sources: apache-license-2, spdx-license-list, osi-osd*

**What it is** The family — MIT, the BSD licences, Apache-2.0 in SPDX identifiers — whose
conditions on redistribution amount to carrying notices forward, with no requirement that a
derivative work adopt the same licence. Code under a permissive licence can be combined into
a proprietary product and shipped as a binary with no source obligation whatever.

**Why it matters** Permissive versus copyleft is the central comparison of this competency,
and it is decided by one question: does the licence say anything about the licence of the
work you build on top of it? A permissive licence does not. That is why permissive code
appears inside commercial products with nothing published in return but an attribution file.

**How it works** The conditions are of one kind: preserve the copyright notice, the licence
text, and the disclaimer when redistributing, in source form and, for the BSD licences, in
the documentation accompanying a binary. Apache-2.0 adds two more of the same kind —
prominent notices on modified files and propagation of a NOTICE file's contents — plus an
express patent grant. Nothing in any of them reaches the surrounding work, so a downstream
distributor chooses its own terms for its own code and may ship the whole thing without
source.

**Key terms** attribution; notice retention; relicensing downstream; no source obligation;
SPDX identifier.

**Traps** Permissive does not mean obligation-free, and it does not mean public domain.
Stripping the copyright notice out of an MIT-licensed file and shipping it is the standard
permissive-licence violation, and it is a violation of the only condition the licence has.
Permissive also does not mean "no patent risk": MIT and the BSD licences say nothing about
patents at all, which is a difference from Apache-2.0, not a reassurance.

**What the exam may test** Deciding whether a described reuse — static linking into a closed
product, redistribution of a modified binary, shipping without publishing source — is
permitted, and identifying the attribution obligation that still applies when it is.

*Not to be confused with [copyleft licenses](open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.copyleft-licenses).*

<a id="c-pm.open-source-software-and-licensing.copyleft-licenses"></a>
### Copyleft licenses
*id: `pm.open-source-software-and-licensing.copyleft-licenses` · depth 3 · importance 1 · LFS200: PARTIALLY COVERED · sources: gnu-gpl-faq, gnu-free-sw*

**What it is** The family — the GPL and its relatives — that attaches a reciprocal
obligation to the grant: you receive the right to modify and redistribute, and in exchange,
when you distribute a work based on the covered code, you must pass the same rights on under
the same licence, with source. Critics call this "viral"; that is a pejorative, not a term of
art, and it misdescribes the mechanism, which is a condition on an act of distribution rather
than something that spreads by contact.

**Why it matters** Every practical copyleft question turns on the trigger. GPLv3 states it
plainly: you may make, run, and propagate covered works that you do not convey, without
conditions. Modifying a copyleft program for internal use and never handing it to anyone
obliges nothing at all. The obligation attaches when a copy reaches someone else.

**How it works** Strong copyleft (the GPL) reaches the whole combined work: when a modified
or combined work is conveyed, the entire thing must be licensed to recipients under the same
licence, and the Corresponding Source made available. Weak copyleft narrows the reach to a
defined boundary — the LGPL confines it to the library itself and leaves the application that
links to it free, and file-level copyleft such as MPL-2.0 confines it to the files taken from
the project, leaving new files under other terms. The reciprocal obligation is the family's
defining feature; how far it reaches is what separates its members.

**Key terms** reciprocal obligation; conveying versus using; strong versus weak copyleft;
Corresponding Source; same-licence condition.

**Traps** Copyleft does not forbid commercial use, does not forbid charging for copies, and
does not reach software that merely runs alongside the covered work. It also does not trigger
on use: internal modification, and — for the GPL — offering the modified program to the
public as a network service, both convey nothing, which is the specific gap the AGPL was
written to close.

**What the exam may test** Given a described action — running a modified copy internally,
shipping it to a customer, hosting it as a service, linking a library into a closed product —
deciding whether a copyleft obligation is triggered and how far it reaches.

<a id="cmp-pm.open-source-software-and-licensing.copyleft-licenses"></a>
#### Not to be confused with: Copyleft licenses vs Permissive licenses
*compares: `pm.open-source-software-and-licensing.copyleft-licenses`, `pm.open-source-software-and-licensing.permissive-licenses`*

| | Copyleft licenses | Permissive licenses |
| --- | --- | --- |
| Condition on the derivative work's licence | Yes — the distributed work goes out under the same licence | None — the distributor chooses its own terms |
| Source obligation on distribution | Corresponding Source must be made available to recipients | No source obligation at all |
| What triggers the obligation | Distributing (conveying) a covered or combined work | Distributing, but only to the extent of carrying notices |
| Usable inside a closed proprietary product | Not while remaining closed, for strong copyleft | Yes, this is the normal case |
| Obligations when used purely internally | None — running and modifying without conveying is unconditioned | None |

The separating axis is whether the licence says anything about the licence of what you build:
copyleft imposes the same terms on the distributed derivative, permissive imposes only
attribution. Neither reaches you until you distribute.

#### Scenario

A team vendors two third-party components into a product it ships to customers as a binary
appliance: one MIT-licensed utility, lightly patched, and one GPLv2 daemon, also patched. The
MIT component obliges the copyright and permission notice to travel with the shipped copies,
and nothing more — the patches need not be published and the product's own source stays
closed. The GPLv2 daemon is a different matter: conveying the modified daemon obliges the
team to license that work to recipients under the GPL and to make its Corresponding Source
available, so the patches cannot stay private once the appliance ships. Had the team run the
same patched daemon only on its own servers, with no copy leaving the building, the GPL would
have obliged nothing — running and modifying without conveying is unconditioned.

#### Knowledge check

1. State the reciprocal obligation of copyleft in one sentence, without the word "viral."
   When you distribute a work based on the covered code, you must license that work to
   recipients under the same licence and make the Corresponding Source available.
2. What act triggers a GPL obligation — using, modifying, or distributing?
   Distributing (conveying). Running and modifying a covered work you do not convey carries no
   conditions.
3. What is the only obligation a bare MIT licence imposes on a redistributor?
   Carrying the copyright notice and permission notice along with the copies.
4. What separates strong copyleft from weak copyleft?
   How far the same-licence condition reaches: strong copyleft covers the whole combined work,
   weak copyleft is confined to the library or to the covered files.
5. May a company sell software that contains copyleft components?
   Yes. Copyleft constrains the licence and source availability passed to recipients, not the
   price charged.

<a id="s-open-source-software-and-licensing-specific-licenses"></a>
## Specific licenses

<a id="c-pm.open-source-software-and-licensing.gpl"></a>
### GPL
*id: `pm.open-source-software-and-licensing.gpl` · depth 3 · importance 1 · LFS200: PARTIALLY COVERED · sources: kernel-license-rules, gnu-gpl-faq, spdx-license-list*

**What it is** The GNU General Public License, the reference strong-copyleft licence, in two
live versions: GPLv2 (1991), under which the Linux kernel is released as GPL-2.0-only, and
GPLv3 (2007). Conveying a modified version obliges the distributor to license the entire work
under the same licence and to make the Corresponding Source available to recipients.

**Why it matters** The GPL is the licence the exam reaches for whenever it wants a concrete
copyleft example, and the kernel is the concrete GPL example. Two facts about it are worth
holding exactly: the kernel is GPL-2.0-only, not "v2 or later," and the kernel carries an
explicit syscall exception so that user-space programs merely making system calls are not
treated as derivative works of the kernel.

**How it works** GPLv3 section 5 requires a conveyed modified source version to carry
prominent notices that it was modified and when, to state that it is released under this
licence, and to be licensed "as a whole" under the GPL to anyone who comes into possession of
a copy. Conveying object code instead obliges the distributor to accompany it with the
Corresponding Source or with a written offer for it. GPLv3 adds to GPLv2 an express patent
grant, Installation Information for user products (so a modified version can actually be
installed on the device it shipped on), and a cure provision under which a terminated licence
can be reinstated; GPLv2 terminates on violation with no cure clause. The two versions are
not compatible with each other unless a work is offered under "v2 or later," which is what
the "-or-later" SPDX suffix records.

**Key terms** GPL-2.0-only; GPL-3.0-or-later; conveying; Corresponding Source; syscall
exception; anti-tivoization.

**Traps** The GPL does not reach a proprietary program that merely runs on a GPL system, nor
one that runs as a separate process exchanging data over pipes, sockets, or command-line
arguments; the FSF's criterion is the mechanism and semantics of the communication, not
whether the interface is documented, and modules in one executable, or designed to run linked
together in a shared address space, are almost surely one combined program — which is exactly
the case the LGPL exists to permit. For Linux specifically, the kernel's syscall exception
(`LICENSES/exceptions/Linux-syscall-note`) makes the user-space case explicit rather than
leaving it to argument. The licence does not reach a modified version that is never conveyed,
and it does not reach
users of a network service, because mere interaction over a network with no transfer of a
copy is not conveying. "GPL" unqualified is also ambiguous between v2 and v3, whose terms
differ and which cannot be combined in one work without an "or later" grant.

**What the exam may test** Identifying the kernel's licence precisely (GPLv2, only), deciding
whether a described distribution triggers the source obligation, and separating GPL from its
network and linking variants.

<a id="cmp-pm.open-source-software-and-licensing.gpl"></a>
#### Not to be confused with: GPL vs AGPL vs LGPL
*compares: `pm.open-source-software-and-licensing.gpl`, `pm.open-source-software-and-licensing.agpl`, `pm.open-source-software-and-licensing.lgpl`*

| | GPL | AGPL | LGPL |
| --- | --- | --- | --- |
| Strength of copyleft | Strong — the whole conveyed work | Strong, plus a network trigger | Weak — confined to the library |
| What triggers the source obligation | Conveying a copy of the work | Conveying, or remote network interaction with a modified version (section 13) | Conveying the library or a work based on it |
| Proprietary application may link to it | Not while staying proprietary | Not while staying proprietary | Yes, under LGPLv3 section 4's relink conditions (LGPL-2.1 section 6) |
| Covers a hosted, never-distributed service | No — network interaction without transferring a copy is not conveying | Yes, this is the gap it closes | No |
| SPDX identifier | `GPL-2.0-only`, `GPL-3.0-or-later` | `AGPL-3.0-only` | `LGPL-3.0-only`, `LGPL-2.1-only` |

The separating axis is where the same-licence condition stops: the LGPL stops at the library
boundary, the GPL stops at the conveyed work, and the AGPL extends past conveyance to reach
users who only ever interact with the software across a network.

<a id="c-pm.open-source-software-and-licensing.mit-and-bsd-licenses"></a>
### MIT and BSD licenses
*id: `pm.open-source-software-and-licensing.mit-and-bsd-licenses` · depth 3 · importance 1 · LFS200: MENTIONED ONLY · sources: spdx-license-list, osi-osd*

**What it is** The shortest permissive licences in common use. MIT grants use, copying,
modification, merging, publication, distribution, sublicensing, and sale on one condition:
the copyright notice and the permission notice must be included in all copies or substantial
portions of the software. BSD-2-Clause requires the notice, conditions, and disclaimer to be
retained in redistributed source and reproduced in the documentation accompanying a binary;
BSD-3-Clause adds a third clause forbidding use of the copyright holder's or contributors'
names to endorse derived products without written permission.

**Why it matters** These are the licences an exam question uses when it wants "reuse in a
closed product with almost no strings." Knowing exactly which strings remain — the notice,
and for BSD-3-Clause the non-endorsement clause — is the difference between the right answer
and the tempting "no obligations at all."

**How it works** SPDX identifiers disambiguate what plain English cannot: `MIT`,
`BSD-2-Clause` ("Simplified"), `BSD-3-Clause` ("New" or "Revised"), and the historical
`BSD-4-Clause` ("Original"), which carries an advertising clause, is not OSI-approved, and is
regarded by the Free Software Foundation as incompatible with the GPL. Neither MIT nor any
BSD variant grants patent rights, requires a NOTICE file, or requires modified files to be
marked.

**Key terms** notice retention; non-endorsement clause; advertising clause; `BSD-3-Clause`;
substantial portions.

**Traps** "BSD licence" unqualified names at least three different texts with materially
different terms, which is precisely why SPDX identifiers exist. And permissive is not public
domain: dropping the MIT notice from a redistributed file breaches the single condition the
licence carries.

**What the exam may test** Naming the one condition MIT imposes, distinguishing the BSD
variants by clause count, and recognising that neither family says anything about patents.

*Not to be confused with [Apache License 2.0](open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.apache-license-2-0).*

<a id="c-pm.open-source-software-and-licensing.apache-license-2-0"></a>
### Apache License 2.0
*id: `pm.open-source-software-and-licensing.apache-license-2-0` · depth 3 · importance 1 · LFS200: MENTIONED ONLY · sources: apache-license-2*

**What it is** The permissive licence (SPDX `Apache-2.0`) that adds to the permissive bargain
an express patent grant and a set of explicit redistribution conditions. It is the licence
that answers "which permissive licence deals with patents," because MIT and BSD do not deal
with them at all.

**Why it matters** Its two additions are the discrimination points the exam has to work with
inside the permissive family: section 3's patent licence, with its termination clause, and
section 4's notice requirements, of which the NOTICE file is the most commonly misremembered.

**How it works** Section 3 grants each recipient a perpetual, worldwide, royalty-free,
irrevocable patent licence covering the claims a contributor's own contribution necessarily
infringes, alone or in combination with the Work to which it was submitted — but not the
contributor's whole patent portfolio — and terminates that grant for anyone who files patent
litigation alleging the work infringes. Section 4 conditions redistribution on four things: give recipients a copy of
the licence; cause modified files to carry prominent notices stating that you changed them;
retain the copyright, patent, trademark, and attribution notices found in the source; and, if
the work includes a NOTICE text file, include a readable copy of its attribution notices in
the derivative work's own NOTICE file, its documentation, or a display it generates. Section
5 provides that contributions submitted for inclusion are under the same licence terms unless
the contributor states otherwise.

**Key terms** patent grant; patent-litigation termination; NOTICE file; modification notices;
`Apache-2.0`.

**Traps** The NOTICE file is not the licence file, and the obligation only exists if the
upstream work ships one — a NOTICE requirement invented for a project that has no NOTICE file
is a distractor. The patent grant is limited to claims infringed by the contributor's own
contribution, alone or in combination with the work it was submitted to — not to the
contributor's whole patent portfolio. And Apache-2.0 is not a
copyleft licence: none of section 4's conditions reaches the licence of the derivative work
as a whole. The Free Software Foundation treats Apache-2.0 as compatible with GPLv3 but not
with GPLv2.

**What the exam may test** Naming what Apache-2.0 adds over MIT — the patent grant, the
change notices, the NOTICE propagation — without wrongly adding a copyleft obligation to the
list.

<a id="cmp-pm.open-source-software-and-licensing.apache-license-2-0"></a>
#### Not to be confused with: Apache License 2.0 vs MIT and BSD licenses
*compares: `pm.open-source-software-and-licensing.apache-license-2-0`, `pm.open-source-software-and-licensing.mit-and-bsd-licenses`*

| | Apache License 2.0 | MIT and BSD licenses |
| --- | --- | --- |
| Express patent grant | Yes, section 3, terminating on patent litigation | None — patents are not addressed |
| Must mark modified files | Yes, section 4(b) | No |
| NOTICE file propagation | Yes, section 4(d), when the work ships a NOTICE | No such concept |
| Length and reading effort | Long, with definitions and numbered conditions | Short — MIT is a single paragraph of conditions |
| Reach into the derivative work's licence | None — permissive, like the others | None |
| Compatibility with the GPL | Compatible with GPLv3, not GPLv2, per the FSF | MIT and BSD-2/3-Clause are GPL-compatible |

The separating axis is patents and notices, not copyleft: all of these let a derivative be
closed, and Apache-2.0 differs by granting patent rights explicitly and by spelling out the
notice obligations that MIT leaves to a single sentence.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.open-source-software-and-licensing.lgpl` | LGPL | Weak copyleft (`LGPL-3.0-only`): an application may link to the library and ship under its own terms if users can relink against a modified library. | The permission covers the combined work, not the library: modifications to the library itself stay under the LGPL. [Not to be confused with GPL](open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.gpl). |
| `pm.open-source-software-and-licensing.agpl` | AGPL | The GPL plus section 13 (`AGPL-3.0-only`): users interacting with a modified version over a network must be offered its Corresponding Source. | Triggered by network interaction with a modified version, not by distribution — the plain GPL never reaches that case, since interaction over a network with no transfer of a copy is not conveying. [Not to be confused with GPL](open-source-software-and-licensing.md#cmp-pm.open-source-software-and-licensing.gpl). |
| `pm.open-source-software-and-licensing.creative-commons-and-public-domain` | Creative Commons and public domain | Licences for content rather than code (`CC-BY-4.0`), plus dedications such as `CC0-1.0` that waive rights outright. | Creative Commons recommends against CC licences for software: they address neither source distribution nor patents, and the NC and ND variants would fail the Open Source Definition. |

#### Scenario

A vendor builds a hosted analytics service on three components: an Apache-2.0 charting
library it patched, an LGPL-licensed maths library it links dynamically and did not touch,
and an AGPL-licensed database engine it patched for performance. Nothing is distributed —
customers only reach the service over the web. The Apache-2.0 patches oblige nothing further
here, since section 4's conditions bite on redistribution and no copy is being shipped; the
LGPL is likewise quiet, since the library is unmodified and not conveyed. The AGPL engine is
the exception: section 13 requires that users interacting with the modified version remotely
over a network be offered its Corresponding Source, and that trigger does not need a copy to
change hands. Had the engine been plain GPLv2, the same hosting arrangement would have
obliged nothing at all.

#### Knowledge check

1. Under which licence and version is the Linux kernel released, and what does the "-only"
   matter?
   GPLv2, as `GPL-2.0-only` — not "v2 or later," so the kernel's terms cannot be swapped for
   GPLv3's.
2. What does AGPL section 13 add over the GPL, and what triggers it?
   An obligation to offer Corresponding Source to users interacting with a modified version
   remotely over a network; the trigger is that interaction, not distribution.
3. How does the LGPL let proprietary software link to a copyleft library?
   LGPLv3 section 4 (LGPL-2.1 section 6) permits conveying the combined work under your own
   terms if users can replace the library with a modified version — via a suitable
   shared-library mechanism, or by supplying relinkable object code — with notice and a copy of
   the licence.
4. Name the two things Apache-2.0 requires that MIT does not.
   An express patent grant with litigation termination (section 3), and section 4's notices:
   marking modified files and propagating the NOTICE file's attributions.
5. What is the single condition the MIT licence imposes?
   Including the copyright notice and permission notice in all copies or substantial portions
   of the software.
6. Why are Creative Commons licences a poor fit for source code?
   Creative Commons recommends against it: the licences address neither source distribution
   nor patent rights, and are not compatible with the major software licences.

<a id="s-open-source-software-and-licensing-compliance"></a>
## Compliance

<a id="c-pm.open-source-software-and-licensing.license-compatibility"></a>
### License compatibility
*id: `pm.open-source-software-and-licensing.license-compatibility` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: gnu-gpl-faq, spdx-license-list*

**What it is** Whether two differently licensed components can lawfully be combined into one
distributed work — that is, whether one set of conditions can be satisfied at the same time
as the other. Two licences are incompatible when each demands something the other forbids.

**Why it matters** Compatibility is directional, and the direction is the examinable part.
Permissive code can be taken into a copyleft project, because the permissive conditions
(carry the notice) can still be met once the combined work goes out under the GPL. The
reverse fails: GPL code cannot be absorbed into a work distributed under a permissive licence,
because the GPL requires the whole conveyed work to go out under the GPL, and a permissive
licence cannot promise that.

**How it works** The practical cases repeat. MIT and BSD-2/3-Clause code combines into GPL
projects freely. Apache-2.0 combines one way into GPLv3, but the Free Software Foundation
treats it as incompatible with GPLv2. GPLv2-only and GPLv3 works cannot be combined at all
unless one side was offered as "or later," which is exactly what SPDX's `-or-later` suffix
records. Creative Commons BY-SA 4.0 is one-way compatible with GPLv3, and no further.

**Key terms** directional compatibility; one-way compatibility; `-or-later`; combined work.

<a id="c-pm.open-source-software-and-licensing.license-compliance"></a>
### License compliance
*id: `pm.open-source-software-and-licensing.license-compliance` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: apache-license-2, gnu-gpl-faq*

**What it is** Actually doing what the licences of the components you shipped require:
retaining copyright and licence notices, including the licence text, marking modified files
where required, propagating a NOTICE file's attributions, and making Corresponding Source
available where a copyleft licence demands it.

**Why it matters** Compliance and compatibility answer different questions and are routinely
offered as each other's distractor. Compatibility asks whether the combination was permitted
at all; compliance asks whether the obligations that combination triggered were met when the
product went out of the door. A perfectly compatible stack is still non-compliant if the
attribution file was never assembled.

**How it works** The obligations follow the act of distribution, so the practical work is
inventory-driven: know every component in the shipped artifact, know each one's licence, and
discharge that licence's conditions in the artifact itself. Permissive components generally
resolve to notices carried in an attribution document; Apache-2.0 components add change
notices and NOTICE contents; copyleft components add the source offer. Nothing is owed for
components used only internally and never conveyed.

**Key terms** attribution notice; NOTICE propagation; source offer; shipped artifact.

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.open-source-software-and-licensing.dual-licensing` | Dual licensing | The copyright holder offers the same code under both an open source licence and a separate commercial licence. | Only the rights holder can do it — a downstream recipient cannot relicense code it merely received — and the open source copy's terms are unchanged. |
| `pm.open-source-software-and-licensing.contributor-license-agreement` | Contributor license agreement | An agreement in which a contributor grants the project explicit copyright, and often patent, rights over the contribution. | Not copyright assignment — the contributor keeps ownership. Some projects take a Developer Certificate of Origin sign-off instead, asserting provenance rather than granting rights. |
| `pm.open-source-software-and-licensing.software-bill-of-materials` | Software bill of materials | A machine-readable inventory of a build's components — supplier, version, dependency relationships — commonly in SPDX or CycloneDX format. | An inventory, not a compliance artifact and not a vulnerability scan: it makes licence and CVE questions answerable, and answers neither itself. |

#### Scenario

A product team assembles a shipped appliance from an MIT utility, an Apache-2.0 library it
modified, and a GPLv3 tool it did not modify, and asks whether it is clear to release. Two
separate questions have to be answered. Compatibility first: MIT and Apache-2.0 code both
combine into a GPLv3-licensed work, so the combination is permitted — though had the tool been
GPLv2-only, the Apache-2.0 library could not have joined it. Compliance second: the MIT
notice must travel with the shipped copies, the modified Apache-2.0 files must carry notices
saying they were changed and the upstream NOTICE attributions must be reproduced, and the
GPLv3 tool obliges an offer of Corresponding Source to recipients. An SBOM of the appliance
is what makes that list enumerable in the first place; it discharges none of the obligations
itself.

#### Knowledge check

1. In which direction does permissive-to-copyleft compatibility work, and why not the other
   way?
   Permissive code can enter a copyleft project, since its notice condition survives the
   combination; copyleft code cannot be shipped under permissive terms, because the GPL
   requires the whole conveyed work to go out under the GPL.
2. Can a GPLv2-only component and a GPLv3 component be combined into one distributed work?
   No, unless one side was offered as "or later" — which is what the `-or-later` SPDX suffix
   records.
3. What is the one-sentence difference between licence compatibility and licence compliance?
   Compatibility asks whether the components may lawfully be combined; compliance asks whether
   the obligations that combination triggered were actually met on distribution.
4. Who is able to dual-license a project, and who is not?
   The copyright holder (directly, or through contributor agreements). A downstream recipient
   cannot relicense code it merely received.
5. Does an SBOM make a product compliant?
   No. It is an inventory of components and versions; it makes the obligations enumerable but
   discharges none of them.
6. How does a CLA differ from copyright assignment?
   A CLA grants the project a licence — copyright and often patent — while the contributor
   normally keeps ownership; assignment transfers ownership outright.

<a id="s-open-source-software-and-licensing-community"></a>
## Community

<a id="c-pm.open-source-software-and-licensing.contributing-to-open-source"></a>
### Contributing to open source
*id: `pm.open-source-software-and-licensing.contributing-to-open-source` · depth 2 · importance 1 · LFS200: NOT COVERED · sources: asf-how-it-works*

**What it is** The normal path by which an outsider's change reaches a project: raise or claim
an issue, work on a copy, submit the change for review as a pull request or a patch to a
mailing list, respond to review comments, and have a committer merge it. A code of conduct
governs the conversation around all of it.

**Why it matters** The exam treats contribution as a process question, not a coding one, and
the reliably testable part is that the change is proposed, not applied: an outside contributor
has no write access to the project's repository, which is why review by someone who does is a
structural step rather than a courtesy.

**How it works** Mechanics differ by project — GitHub pull requests in most, patches on a
mailing list in others — but the sequence is the same, and the merge decision belongs to the
project, not the contributor. At the Apache Software Foundation the project management
committee holds that decision, and committers are developers who earned write access on merit
and have a contributor licence agreement on file. Many projects also require a licensing or
provenance step on each contribution, whether a CLA on file or a Developer Certificate of
Origin sign-off in the commit.

**Key terms** issue; pull request; code review; committer; code of conduct.

<a id="c-pm.open-source-software-and-licensing.forking-a-project"></a>
### Forking a project
*id: `pm.open-source-software-and-licensing.forking-a-project` · depth 3 · importance 1 · LFS200: NOT COVERED · sources: osi-osd*

**What it is** Taking a copy of a project's code and continuing it as an independent line of
development under separate direction. Open source licences protect this explicitly: the Open
Source Definition requires that a licence permit modifications and derived works and allow
them to be distributed under the same terms as the original.

**Why it matters** The fork is the structural reason open source governance disputes have an
exit. No licence holder, foundation, or vendor can prevent a community that disagrees with a
project's direction from continuing the code themselves, which is why forkability is
described as the ultimate check on a project's stewardship rather than as a failure mode.

**How it works** A fork inherits the original's licence for the code it took: a fork of a
copyleft project continues under that copyleft licence, while a fork of a permissively
licensed project may be redistributed under different terms, subject to the notice conditions.
What a fork does not inherit is identity — trademarks and project names usually stay with the
original holder, which is why forks are renamed. In the governance sense, forking is a
deliberate split; in day-to-day platform vocabulary, "fork" also names a server-side copy of a
repository created as the first step of an ordinary contribution, which is the opposite of a
split.

**Key terms** derived work; independent direction; trademark; hard fork; upstream.

**Traps** The two meanings of "fork" are the trap. Clicking fork on a hosting platform to open
a pull request is a routine contribution step that ends in a merge back upstream; forking a
project in the governance sense is a permanent divergence with its own maintainers and
releases. A fork also cannot escape a copyleft licence by being a fork — the licence travels
with the code.

**What the exam may test** Recognising forking as a right the licence guarantees rather than a
hostile act, and distinguishing the governance sense from the repository-copy sense the
tooling uses.

*Not to be confused with [clone vs fork](../05-devops/git-concepts.md#cmp-devops.git-concepts.clone-vs-fork).*

#### Quick reference

| Concept | Term | In one sentence | Why it is examinable |
| --- | --- | --- | --- |
| `pm.open-source-software-and-licensing.open-source-community-roles` | Open source community roles | Users, contributors, committers with write access, and maintainers or committee members, with responsibility rising along the chain. | The chain is earned by merit, not employment or seniority, and the decision to merge belongs to the project's committee rather than the individual committer. |
| `pm.open-source-software-and-licensing.governance-and-foundations` | Governance and foundations | Neutral non-profits such as the Linux Foundation and Apache Software Foundation hold a project's assets, trademarks, and infrastructure so no single vendor controls it. | A foundation provides legal shelter and governance rules; it does not set technical direction, which stays with the project's maintainers. |

#### Scenario

A contributor's change to a foundation-hosted project is rejected by the project management
committee after review, and they threaten to "take the project elsewhere." Separate the layers.
The contribution path is working as designed: an outside contributor proposes a change and
someone with write access decides, and at the foundation that decision belongs to the committee
rather than to the committer who happens to hold the merge button. The threat is also a real
right, not a bluff — the licence guarantees derived works, so the contributor may fork the code
and continue it independently, inheriting the licence but not the project's trademark, which
the foundation holds. What the foundation would not do in either case is overrule the technical
decision: it holds assets and sets governance, not direction.

#### Knowledge check

1. What is the difference between a contributor and a committer?
   A contributor proposes changes; a committer has write access to the repository, granted on
   merit, and can merge them.
2. Why can no vendor or foundation prevent a project from being forked?
   The licence itself grants the right to make and distribute derived works — the Open Source
   Definition requires it.
3. A fork of a GPL project wants to ship under a permissive licence. May it?
   No. The licence travels with the code it took; only the copyright holder could relicense.
4. What is the one-sentence difference between forking in the governance sense and a fork on a
   hosting platform?
   Governance forking is a permanent divergence with its own maintainers; a platform fork is a
   repository copy made as the first step of a contribution that ends in a merge upstream.
5. What does a foundation such as the Linux Foundation or the ASF actually provide?
   Legal entity, asset and trademark stewardship, infrastructure, and governance rules — not
   technical direction.
