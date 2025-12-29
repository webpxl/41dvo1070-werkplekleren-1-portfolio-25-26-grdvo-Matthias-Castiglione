// Mobile navigation: injects a hamburger into the header and toggles a full-screen menu on mobile
(function(){
    // wait until DOM ready
    function ready(fn){
        if(document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function(){
        var header = document.querySelector('.header');
        if(!header) return;

        var nav = header.querySelector('.header-right');
        if(!nav) return;

        // create hamburger button
        var btn = document.createElement('button');
        btn.className = 'mobile-hamburger';
        btn.setAttribute('aria-label','Toggle navigation');
        btn.setAttribute('aria-expanded','false');
        btn.setAttribute('type','button');

        // bars
        for(var i=0;i<3;i++){
            var bar = document.createElement('span');
            bar.className = 'bar';
            btn.appendChild(bar);
        }

        // put hamburger into body so it can be fixed above everything
        document.body.appendChild(btn);

        // create a full-screen menu container (hidden by default)
        var full = document.createElement('div');
        full.className = 'mobile-fullscreen-menu';
        full.setAttribute('aria-hidden','true');

        // create an inner wrapper to host the cloned nav links
        var inner = document.createElement('div');
        inner.className = 'mobile-fullscreen-inner';

        // Instead of cloning the full nav (which may be hidden by .header-right rules),
        // create fresh anchor elements from the existing nav links so they are always visible.
        var originalLinks = nav.querySelectorAll('a');
        originalLinks.forEach(function(link){
            var a = document.createElement('a');
            a.href = link.getAttribute('href');
            a.textContent = link.textContent.trim();
            // copy target/rel if present
            if(link.hasAttribute('target')) a.setAttribute('target', link.getAttribute('target'));
            if(link.hasAttribute('rel')) a.setAttribute('rel', link.getAttribute('rel'));
            inner.appendChild(a);
        });

        // add a close button inside the full-screen menu
        var closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-fullscreen-close';
        closeBtn.setAttribute('aria-label','Close menu');
        closeBtn.innerHTML = '&times;';
        inner.appendChild(closeBtn);

        full.appendChild(inner);
        document.body.appendChild(full);

        function openMenu(){
            full.classList.add('open');
            btn.classList.add('open');
            btn.setAttribute('aria-expanded','true');
            full.setAttribute('aria-hidden','false');
            // prevent body scroll when menu open
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            // move focus into first link if possible
            var firstLink = full.querySelector('a');
            if(firstLink) firstLink.focus();
        }
        function closeMenu(){
            full.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded','false');
            full.setAttribute('aria-hidden','true');
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            // return focus to hamburger
            btn.focus();
        }

        btn.addEventListener('click', function(){
            if(full.classList.contains('open')) closeMenu();
            else openMenu();
        });

        // close button inside menu
        closeBtn.addEventListener('click', function(){ closeMenu(); });

        // close when clicking outside inner container (on the full-screen background)
        full.addEventListener('click', function(e){
            if(e.target === full) closeMenu();
        });

        // close menu when a nav link in the cloned menu is clicked
        var links;
        function wireLinks(){
            links = full.querySelectorAll('a');
            links.forEach(function(a){
                a.addEventListener('click', function(){
                    // allow navigation to proceed but close the menu immediately
                    closeMenu();
                });
            });
        }
        wireLinks();

        // close on Escape key
        window.addEventListener('keydown', function(ev){
            if(ev.key === 'Escape' && full.classList.contains('open')){
                closeMenu();
            }
        });

        // ensure menu state is reset on resize to desktop
        window.addEventListener('resize', function(){
            if(window.innerWidth > 600){
                closeMenu();
                // clean up inline styles
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            }
        });
    });
})();
