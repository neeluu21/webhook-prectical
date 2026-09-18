<?php

// Secure Webhook Receiver Example

$secret = "MY_SUPER_SECRET_KEY";

$payload = file_get_contents('php://input');

$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

if (empty($signature)) {
    http_response_code(400);
    die("Error: Missing GitHub signature header.");
}

$calculated_signature = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!hash_equals($calculated_signature, $signature)) {
    http_response_code(401);
    die("Error: Signature verification failed. Unauthorized request.");
}

$data = json_decode($payload, true);

$event = $_SERVER['HTTP_X_GITHUB_EVENT'] ?? 'unknown';

$log_message = "[" . date('Y-m-d H:i:s') . "] Event received: " . strtoupper($event) . "\n";

if ($event === 'push') {

    $repo = $data['repository']['full_name'] ?? 'Unknown Repo';
    $branch = str_replace('refs/heads/', '', $data['ref'] ?? '');
    $pusher = $data['pusher']['name'] ?? 'Unknown User';
    $commit_msg = $data['head_commit']['message'] ?? 'No message';

    $log_message .= " - Repository: $repo\n";
    $log_message .= " - Branch: $branch\n";
    $log_message .= " - Pushed By: $pusher\n";
    $log_message .= " - Commit Message: $commit_msg\n";

} elseif ($event === 'pull_request') {

    $action = $data['action'] ?? 'unknown';
    $pr_number = $data['number'] ?? '';
    $title = $data['pull_request']['title'] ?? '';
    $merged = $data['pull_request']['merged'] ?? false;

    if ($action === 'closed' && $merged) {
        $log_message .= " - Action: MERGED\n";
    } else {
        $log_message .= " - Action: " . strtoupper($action) . "\n";
    }

    $log_message .= " - PR #$pr_number: $title\n";

} else {

    $log_message .= " - Triggered action details generic payload.\n";
}

$log_message .= "-------------------------------------------------------\n";

file_put_contents('webhook_activity.log', $log_message, FILE_APPEND);

http_response_code(200);

echo "Webhook processed successfully!";
?>
