# Hardening run: harness runbook

The plan and its reasons: the Claude Doc "Home LLM server hardening plan". This folder turns it into scripts. Each script does one step, checks its own result, undoes itself where it can, and appends one line to run-log.md ending in PASS or FAIL. Scripts never print a secret.

Who does what: scripts run commands, wait out restarts and check results. The local model (client/ask-local.ps1) reads long output (a failure, backup.log, docker logs) and makes the one edit to docker-compose.yml. The harness (Claude Code) picks the next step, validates each PASS line, stops on FAIL and tells Zo. Zo does the clicks in the chat pages and n8n, limesalt, the claude_agent account and the password manager.

Rules for the harness
1. Run from the repo root on lemonpepper, as awill. One step at a time, in the order below.
2. Validate a step by reading the last line of run-log.md only. PASS: go on. FAIL: stop that step.
3. On FAIL, do not read long output yourself. Hand it to the local model: powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/client/ask-local.ps1 -Route local-think -Prompt "This is the output of a failed step. Name the cause in two sentences and the single most likely fix." -File <output file> -Task hardening-diagnose. Then report the cause to Zo and wait.
4. Never open, print or search E:\WHL\compose\.env, anything in C:\Users\awill\.restic, C:\Users\awill\whl-keys.txt, or anything on C: or D:. The scripts handle them.
5. Never call the relay's GET /health. Use /health/liveliness.
6. Admin scripts: Start-Process powershell -Verb RunAs -Wait -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File "<full path>" <args>' and tell Zo to accept the Windows prompt. Then read run-log.md.
7. Steps 2 and 3 restart Ollama and both doors. ask-local.ps1 fails for up to two minutes while a restart script runs. Do not call it until the script has returned.

Steps (command in this folder | admin | Zo does after)
1a 01-disks.ps1 | no | pick the backup drive from the list (default D: if listed) and rebuildable folders to exclude
1b 01-setup-backup.ps1 -Repo <drive>:\Backups\whl-restic [-Exclude 'E:\WHL\..'] | ADMIN | if the PASS line says NEW PASSWORD, copy C:\Users\awill\.restic\whl.pass into the password manager
1c 01-restore-test.ps1 -Repo <same> | no |
2a 02-check.ps1 | no | on FAIL the harness fixes the named line in the WHL file to host.docker.internal, then reruns 2a
2b 02-bind-local.ps1 | no (admin only if it says so) |
2c 02-firewall.ps1 | ADMIN | on limesalt: Test-NetConnection lemonpepper -Port 11434 gives False, -Port 4000 gives True
3a 03-prepare.ps1 | no |
3b compose edit, below | no |
3c 03-start-db.ps1 | no |
3d 03-make-keys.ps1 | no | open C:\Users\awill\whl-keys.txt and paste each key where its line says (both chat pages, n8n, claude_agent, limesalt); send one message on each page; run n8n's credential test; tell the harness "keys in place"
3e 03-check-keys.ps1 | no |
3f 03-deny-agent.ps1 | ADMIN | signed in as claude_agent, run one ask-local.ps1 call; it should answer
3g 03-rotate.ps1 | no | only after "keys in place"; then delete C:\Users\awill\whl-keys.txt
3h client/verify.ps1 | no | expect the two Ollama checks on 11434 to fail (closed on purpose); all else passes
4 04-prune.ps1 | no | first check Admin Panel > Settings > Models on both pages has no entry using the old models

3b, the compose edit by the local model:
$c = 'E:\WHL\compose\docker-compose.yml'
powershell -NoProfile -ExecutionPolicy Bypass -File anthologies/home-library-series/client/ask-local.ps1 -Route local-think -MaxTokens 12000 -File $c -Out E:\WHL\compose\docker-compose.proposed.yml -Task hardening-compose -Prompt (Get-Content anthologies/home-library-series/server/hardening/compose-edit-prompt.txt -Raw)
git diff --no-index $c E:\WHL\compose\docker-compose.proposed.yml
Accept only if the diff adds exactly the litellm-db service, the named volume, DATABASE_URL, LITELLM_SALT_KEY and depends_on on both doors, and DISABLE_ADMIN_UI on the private door, and removes nothing. Then copy the proposed file over the original and run docker compose config -q in E:\WHL\compose. If the model's file is wrong twice, or the file is too large (exit 3), the harness makes the edit itself and says so.

When done: report the PASS lines from run-log.md, anything left for Zo, and that client/verify.ps1, README.md and client/VERIFY.md still describe 11434 as open.
