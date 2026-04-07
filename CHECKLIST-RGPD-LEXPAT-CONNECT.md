# Checklist RGPD — LEXPAT Connect

Derniere mise a jour : 2026-04-07

Ce document sert de checklist interne simple pour verifier, suivre et documenter les points de conformite RGPD de LEXPAT Connect.

## 1. Gouvernance

- [ ] Le responsable de traitement de la plateforme est clairement identifie.
- [ ] La distinction entre `LEXPAT Connect` et le `cabinet LEXPAT` est claire dans les documents et dans le fonctionnement.
- [ ] Une adresse de contact privacy operationnelle est definie et surveillee.
- [ ] Le besoin ou non d'un DPO a ete verifie.
- [ ] Le registre interne des traitements est a jour.

## 2. Registre des traitements

- [ ] Les formulaires de contact sont documentes.
- [ ] Les comptes utilisateurs et l'authentification sont documentes.
- [ ] Les profils travailleurs sont documentes.
- [ ] Les profils employeurs sont documentes.
- [ ] Les offres d'emploi sont documentees.
- [ ] Le matching est documente.
- [ ] Les candidatures sont documentees.
- [ ] La messagerie est documentee.
- [ ] Les retours testeurs sont documentes.
- [ ] Les cookies et preferences sont documentes.
- [ ] Le relais vers le cabinet est documente.

Pour chaque traitement :

- [ ] finalite documentee
- [ ] base legale documentee
- [ ] categories de donnees documentees
- [ ] personnes concernees documentees
- [ ] destinataires documentes
- [ ] transferts eventuels documentes
- [ ] duree de conservation documentee
- [ ] mesures de securite documentees

## 3. Bases legales

- [ ] Chaque traitement repose sur une base legale identifiee.
- [ ] Le consentement n'est utilise que lorsqu'il est reellement necessaire.
- [ ] Les traitements de matching ont une base legale claire.
- [ ] Les repertoires anonymises ont une base legale claire.
- [ ] La messagerie a une base legale claire.
- [ ] Les retours testeurs ont une base legale claire.
- [ ] Les emails transactionnels ont une base legale claire.
- [ ] Les cookies non essentiels reposent bien sur un consentement.

## 4. Transparence et information des personnes

- [ ] La politique de confidentialite est a jour.
- [ ] La politique de confidentialite reflete le fonctionnement reel du site.
- [ ] Les pages FR et EN sont coherentes.
- [ ] Les destinataires des donnees sont clairement identifies.
- [ ] Le point de bascule entre plateforme et cabinet est explique.
- [ ] Le fonctionnement des profils anonymises est explique.
- [ ] Les personnes peuvent comprendre qui traite quoi et pourquoi.

## 5. Sous-traitants et fournisseurs

- [ ] OVHcloud est liste comme fournisseur de domaine / DNS / infrastructure email du domaine.
- [ ] Vercel est liste comme hebergeur/deployeur.
- [ ] Supabase est liste comme fournisseur d'authentification et base de donnees.
- [ ] Resend est liste comme fournisseur d'envoi transactionnel.
- [ ] Google Workspace est liste comme fournisseur de messagerie professionnelle.
- [ ] Les contrats / DPA de ces fournisseurs sont identifies ou archivables.
- [ ] Les transferts eventuels hors UE/EEE sont documentes avec prudence.

## 6. Google Workspace

- [ ] Google Workspace est ajoute dans les sous-traitants du registre RGPD.
- [ ] Google Workspace est mentionne dans la politique de confidentialite.
- [ ] Les Data Processing Terms de Google Workspace sont acceptes.
- [ ] Les parametres `Legal & compliance` sont verifies dans l'Admin Console.
- [ ] L'autorite de controle competente est renseignee si Google le demande.
- [ ] Le DPO ou representant est renseigne si applicable.
- [ ] Aucune promesse marketing inexacte n'est faite sur une localisation "100% UE".
- [ ] L'usage de Workspace est limite a la messagerie professionnelle et bien documente.

## 7. Emails

- [ ] L'adresse de contact du site est operationnelle.
- [ ] L'adresse d'envoi transactionnel est operationnelle.
- [ ] La coherence entre OVH, Google Workspace et Resend est verifiee.
- [ ] DKIM est actif pour le domaine d'envoi.
- [ ] SPF est verifie si necessaire.
- [ ] DMARC est verifie si necessaire.
- [ ] Les emails du site arrivent bien sur la bonne boite.
- [ ] Les emails du site partent avec une adresse coherente.

## 8. Securite technique

- [ ] Le principe de minimisation est applique dans les formulaires.
- [ ] Les acces admin sont restreints.
- [ ] Les tables sensibles ont des regles d'acces adaptees.
- [ ] Les tables coeur metier sont protegees via RLS.
- [ ] `test_feedback` est securise.
- [ ] Les routes serveur utilisent les secrets cote serveur seulement.
- [ ] Les mots de passe et comptes admin critiques sont proteges.
- [ ] Le MFA est active quand c'est possible sur les outils critiques.

## 9. Minimisation et exposition progressive

- [ ] Les formulaires ne demandent pas plus de donnees que necessaire.
- [ ] Les profils affiches aux membres restent anonymises ou partiellement masques au bon stade.
- [ ] Les candidatures n'exposent pas de donnees personnelles au-dela du necessaire.
- [ ] Les matches n'exposent pas plus que ce qui est utile.
- [ ] La messagerie n'est accessible qu'aux parties legitimes.

## 10. Durees de conservation

- [ ] Une duree existe pour les formulaires.
- [ ] Une duree existe pour les profils travailleurs.
- [ ] Une duree existe pour les profils employeurs.
- [ ] Une duree existe pour les offres.
- [ ] Une duree existe pour les candidatures.
- [ ] Une duree existe pour les matches.
- [ ] Une duree existe pour la messagerie.
- [ ] Une duree existe pour les retours testeurs.
- [ ] Une logique d'archivage, suppression ou anonymisation existe.

## 11. Droits des personnes

- [ ] Une procedure simple existe pour les demandes d'acces.
- [ ] Une procedure simple existe pour les demandes de rectification.
- [ ] Une procedure simple existe pour les demandes d'effacement.
- [ ] Une procedure simple existe pour les demandes d'opposition.
- [ ] Une procedure simple existe pour les demandes de limitation.
- [ ] Une procedure simple existe pour la portabilite si applicable.
- [ ] Les demandes sont journalisees en interne.
- [ ] Les delais de reponse sont surveilles.

## 12. Violations de donnees

- [ ] Une procedure d'incident / violation de donnees existe.
- [ ] Les personnes internes savent qui alerter.
- [ ] Les incidents sont documentes.
- [ ] La logique de notification sous 72h est connue.
- [ ] Le seuil d'information des personnes concernees est compris.

## 13. Cookies

- [ ] Le bandeau cookies fonctionne.
- [ ] Refuser est aussi simple qu'accepter.
- [ ] Aucun cookie non essentiel n'est depose avant consentement.
- [ ] La page cookies est coherent avec le vrai fonctionnement du site.
- [ ] Les categories de cookies declarees correspondent aux cookies reels.

## 14. Promesses du site et communication

- [ ] Le site ne promet pas une conformite absolue non verifiee.
- [ ] Les termes "RGPD", "securise", "conforme" sont utilises avec precision.
- [ ] La page securite & conformite correspond au fonctionnement reel.
- [ ] Les promesses relatives a la confidentialite sont exactes.

## 15. Point specifique LEXPAT Connect

- [ ] Le passage de la plateforme au cabinet est explique clairement.
- [ ] Le perimetre du matching est distinct du perimetre juridique.
- [ ] Les donnees partagees au moment du relais juridique sont limitees au necessaire.
- [ ] Le secret professionnel du cabinet est presente dans le bon perimetre.

## 16. Points a verifier immediatement

- [ ] `test_feedback` est bien securise dans Supabase.
- [ ] La politique de confidentialite FR est publiee dans sa derniere version.
- [ ] La politique de confidentialite EN est publiee dans sa derniere version.
- [ ] Le registre RGPD interne est a jour.
- [ ] Google Workspace est ajoute dans le registre et la politique.
- [ ] L'adresse email de contact fonctionne.
- [ ] L'envoi transactionnel fonctionne.
- [ ] OVH / Google Workspace / Resend sont alignes.

## 17. Statut de suivi

- [ ] Conforme / acceptable
- [ ] A surveiller
- [ ] A corriger rapidement
- [ ] A documenter juridiquement

## 18. Notes internes

- Date de la derniere revue :
- Personne ayant fait la revue :
- Points urgents identifies :
- Actions decidees :
- Date de prochaine revue :
