<script setup>
import { ArrowRight } from "@lucide/vue";

import { news } from "@/data/home";
</script>

<template>
  <section
    id="latest-updates"
    class="home-news bg-[#f9fbf8] text-ink-900"
    aria-labelledby="home-news-heading"
  >
    <div class="shell">
      <div class="home-news__header" v-reveal>
        <h2 id="home-news-heading" class="home-news__title">
          {{ news.homeTitle }}
        </h2>

        <div class="home-news__intro">
          <p>{{ news.homeLede }}</p>
          <a :href="news.allLink.href" class="home-news__cta">
            {{ news.allLink.label }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div class="home-news__grid">
        <article class="home-news__featured" v-reveal="{ delay: 80 }">
          <a :href="news.featured.href" class="home-news__featured-link">
            <div class="home-news__featured-image">
              <img
                :src="news.featured.image"
                :alt="news.featured.imageAlt"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div class="home-news__featured-copy">
              <p class="home-news__category">{{ news.featured.category }}</p>
              <h3>{{ news.featured.title }}</h3>
              <p class="home-news__excerpt">{{ news.featured.excerpt }}</p>
              <time>{{ news.featured.date }}</time>
              <span class="home-news__read-more">
                Read more
                <ArrowRight class="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </a>
        </article>

        <div class="home-news__list">
          <article
            v-for="(item, index) in news.items"
            :key="item.title"
            v-reveal="{ delay: 120 + index * 70 }"
            class="home-news__item"
          >
            <a :href="item.href" class="home-news__item-link">
              <div class="home-news__item-image">
                <img
                  :src="item.image"
                  :alt="item.imageAlt"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div class="home-news__item-copy">
                <p class="home-news__category">{{ item.category }}</p>
                <h3>{{ item.title }}</h3>
                <time>{{ item.date }}</time>
                <span class="home-news__read-more">
                  Read more
                  <ArrowRight class="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </a>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-news {
  border-top: 1px solid rgb(4 32 21 / 0.07);
}

.home-news > .shell {
  padding-top: clamp(2.25rem, 3vw, 3rem);
  padding-bottom: clamp(3rem, 4vw, 4rem);
}

.home-news__header {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(18rem, 0.55fr);
  align-items: end;
  gap: clamp(2rem, 5vw, 5rem);
  margin-bottom: clamp(1.75rem, 2.5vw, 2.25rem);
}

.home-news__title {
  max-width: 53rem;
  margin: 0;
  color: var(--color-ink-900);
  font-family: var(--font-sans);
  font-size: clamp(2.25rem, 3.5vw, 3.5rem);
  font-weight: 520;
  line-height: 1.08;
  letter-spacing: -0.035em;
}

.home-news__intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  max-width: 28rem;
  justify-self: end;
}

.home-news__intro p {
  margin: 0;
  color: #6e7771;
  font-size: clamp(0.95rem, 1.1vw, 1.125rem);
  line-height: 1.55;
}

.home-news__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.8rem 1.35rem;
  border-radius: 9999px;
  background: var(--color-maize-400);
  color: var(--color-forest-950);
  font-size: 0.9375rem;
  font-weight: 650;
  line-height: 1;
  text-decoration: none;
  transition:
    transform 180ms ease,
    background-color 180ms ease;
}

.home-news__cta:hover {
  transform: translateY(-2px);
  background: var(--color-maize-300);
}

.home-news__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  align-items: start;
  gap: clamp(2rem, 3.5vw, 4rem);
}

.home-news__featured-link,
.home-news__item-link {
  color: inherit;
  text-decoration: none;
}

.home-news__featured-link {
  display: block;
}

.home-news__featured-image,
.home-news__item-image {
  overflow: hidden;
  border-radius: 5px;
  background: var(--color-cream-100);
}

.home-news__featured-image {
  aspect-ratio: 16 / 9;
}

.home-news__featured-image img,
.home-news__item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 650ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.home-news__featured-link:hover img,
.home-news__item-link:hover img {
  transform: scale(1.045);
}

.home-news__featured-copy {
  padding-top: 1.35rem;
}

.home-news__category {
  margin: 0 0 0.45rem;
  color: var(--color-forest-600);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.home-news h3 {
  margin: 0;
  color: var(--color-ink-900);
  font-family: var(--font-sans);
  font-weight: 540;
  line-height: 1.25;
  letter-spacing: -0.018em;
  transition: color 180ms ease;
}

.home-news__featured h3 {
  max-width: 46rem;
  font-size: clamp(1.35rem, 2vw, 2rem);
}

.home-news__featured-link:hover h3,
.home-news__item-link:hover h3 {
  color: var(--color-forest-700);
}

.home-news__excerpt {
  max-width: 46rem;
  margin: 0.9rem 0 1rem;
  color: #6e7771;
  font-size: 0.9375rem;
  line-height: 1.65;
}

.home-news time {
  display: block;
  color: rgb(19 24 19 / 0.46);
  font-size: 0.8125rem;
}

.home-news__read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1.15rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid currentColor;
  color: var(--color-ink-900);
  font-size: 0.875rem;
  font-weight: 650;
  line-height: 1;
  transition: gap 180ms ease;
}

.home-news a:hover .home-news__read-more {
  gap: 0.85rem;
}

.home-news__list {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.2vw, 1rem);
}

.home-news__item {
  padding-bottom: clamp(0.75rem, 1.2vw, 1rem);
  border-bottom: 1px solid rgb(4 32 21 / 0.1);
}

.home-news__item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.home-news__item-link {
  display: grid;
  grid-template-columns: minmax(10rem, 0.64fr) minmax(0, 1.36fr);
  align-items: start;
  gap: clamp(1.25rem, 2.5vw, 2.25rem);
}

.home-news__item-image {
  aspect-ratio: 16 / 9;
}

.home-news__item h3 {
  font-size: clamp(1.05rem, 1.55vw, 1.45rem);
  line-height: 1.2;
}

.home-news__item .home-news__read-more {
  margin-top: 0.75rem;
}

@media (max-width: 63.999rem) {
  .home-news__header,
  .home-news__grid {
    grid-template-columns: 1fr;
  }

  .home-news__intro {
    max-width: 38rem;
    justify-self: start;
  }

  .home-news__featured-image {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 39.999rem) {
  .home-news__header {
    gap: 1.5rem;
  }

  .home-news__title {
    font-size: clamp(2.15rem, 10vw, 2.65rem);
  }

  .home-news__item-link {
    grid-template-columns: 7.25rem minmax(0, 1fr);
    align-items: start;
    gap: 1.1rem;
  }

  .home-news__item h3 {
    font-size: 1rem;
  }

  .home-news__category {
    margin-bottom: 0.4rem;
    font-size: 0.6875rem;
  }

  .home-news__item .home-news__read-more {
    margin-top: 0.85rem;
    font-size: 0.8125rem;
  }
}
</style>
