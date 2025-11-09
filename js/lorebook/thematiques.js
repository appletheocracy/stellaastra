$(function () {
  const baseUrl = 'https://stella-cinis.forumactif.com/h26-modificateur';

  // Load each remote section into its matching target div
  $('#thema-recurrentes').load(baseUrl + ' #liste_recurrentes > *');
  $('#thema-pas-assez').load(baseUrl + ' #liste_pas-assez > *');
  $('#thema-groupes').load(baseUrl + ' #liste_groupes > *');
});
