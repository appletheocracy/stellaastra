$(function () {
  // Allowed usernames
  const ADMINS = new Set([
    "Stella Cinis",
    "Deus ex Cinere",
    "Astra Cinis",
    "Alyosha Thaln",
    "Salvador Valadez"
  ]);

  // Current username (trim just in case)
  const currentUser = $.trim($("#espace_co_deco #membre_connecte #nom_utilisateur").text());

  // Only proceed if the user is in the allowlist
  if (!ADMINS.has(currentUser)) return;

  // For each post on the page…
  $(".post").each(function () {
    const $post = $(this);

    // Only if the post contains a fiche wrapper
    if (!$post.find(".fiche_wrapper").length) return;

    // Find the EDIT button inside this post
    const $edit = $post.find(".msgdatebtn .profile-icons.bouton_modif .btn-edit").first();
    if (!$edit.length) return;

    // Avoid duplicates
    if ($post.find(".profile-icons .btn-admin").length) return;

    // Use the same href as the EDIT button
    const editHref = $edit.attr("href") || "#";

    // Build and insert the ADMIN button right after EDIT
    $("<a>", {
      "class": "btn-admin",
      href: editHref,
      text: "Administrer"
    }).insertAfter($edit);
  });
});
