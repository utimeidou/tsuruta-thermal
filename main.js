// 1. プラグインの登録
gsap.registerPlugin(ScrollTrigger);

// 2. DOMの構築が完了したらすべてを実行
document.addEventListener("DOMContentLoaded", () => {

  // --- ① FV無限ループ ---
  gsap.to(".fv-loop__track", {
    xPercent: -50,
    duration: 20,
    ease: "none",
    repeat: -1
  });

  // --- ② 大雪山横に流れるエフェクト ---
  gsap.set(".about__image", {
    scale: 1.6,
    yPercent: 30
  });

  gsap.to(".about__image", {
    x: -100,
    ease: "none",
    scrollTrigger: {
      trigger: ".about",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  // --- ③ サービスセクションパララックス ---
  const triggerImg = document.querySelector(".service__hero-image");
  
  if (triggerImg) {
    // 初期配置を上に大きくズラす
    gsap.set(triggerImg, {
      y: -150,
      scale: 1.3
    });

    // スクロールに合わせて下へ大きく動かす
    gsap.to(triggerImg, {
      y: 150,
      ease: "none",
      scrollTrigger: {
        trigger: ".service__hero",
        start: "top bottom",
        end: "bottom top",
        scrub: 1, // 追従遅延（ヌルッと動く効果）
        // markers: true
      }
    });
  }

  // 3. 最後にすべての位置計算をリフレッシュ
  ScrollTrigger.refresh();


// --- ④ クリップパス・マスクスライダー (シンクロ修正版) ---
  const slides = document.querySelectorAll('.fv__slide');
  let currentIdx = 0;
  const slideDuration = 4000; // 4秒ごとに切り替え

  function changeSlide() {
    const nextIdx = (currentIdx + 1) % slides.length;
    
    const currentSlide = slides[currentIdx];
    const nextSlide = slides[nextIdx];

    gsap.set(slides, { zIndex: 1 });
    gsap.set(currentSlide, { zIndex: 2 });

    // 💡【修正】GSAPのバグを防ぐため、プロパティ名を文字列の 'clip-path' に変更
    gsap.set(nextSlide, {
      zIndex: 3,
      'clip-path': "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)", // %を明示
      scale: 1.6
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(nextSlide, { zIndex: 2 });
        gsap.set(currentSlide, { 
          zIndex: 1, 
          'clip-path': "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
        });
        currentIdx = nextIdx;
      }
    });

    // 💡【修正】ここも文字列の 'clip-path' に変更。かつ、CSSの初期値と完全に頂点数を合わせる
    tl.to(nextSlide, {
      'clip-path': "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.6,
      ease: "power4.inOut"
    })
    .to(nextSlide, {
      scale: 1,
      duration: 1.6,
      ease: "power3.out"
    }, "<");
  }

  // 1枚しか画像がないときのバグを防ぐガード
  if (slides.length > 1) {
    setInterval(changeSlide, slideDuration);
  }

}); // ← ここで全ての処理が綺麗に閉じます！