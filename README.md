# Stromule introduction website

A responsive, buildless site for https://stromule.com. This directory is intended to be the root of https://github.com/kumsumit/strosite.

## Preview

Run `python3 -m http.server 8000` from this directory and open http://localhost:8000.

## Publish

Upload the contents of this directory, including `.github` and `.nojekyll`, to the `main` branch of `kumsumit/strosite`. In the repository's **Settings → Pages**, select **GitHub Actions** as the build source. The included workflow publishes the site on pushes to `main`.

Set the custom domain to `stromule.com` in **Settings → Pages**. The included `CNAME` preserves this domain. Configure your DNS using GitHub's current instructions: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site. Enable HTTPS after GitHub verifies the DNS and issues the certificate.

No installation or build command is required. Keep any private files outside this repository: the workflow publishes the checkout as the static site.

## Early access and footer notices

Registration is not open. The early-access button explains this in an accessible dialog and does not store submissions. Replace this with a verified waitlist destination when available. Contact still shows an availability notice. `privacy.html` and `terms.html` describe this informational website and are linked from every footer. Confirm the operator identity, a working privacy contact, and applicable legal requirements before public launch or introducing registration. Update the policies whenever data handling or the product offering changes.

## Assets and dependencies

The supplied Stromule logo is used throughout, with PNG favicons, a multi-size ICO, and an Apple touch icon derived from the original. Diagrams use local CSS/SVG. Poppins and Aref Ruqaa Ink are the only web font families, loaded from Google Fonts with generic platform fallbacks. Social metadata uses a 1200×630 PNG. See `DESIGN.md` for the reference study and interaction decisions.
