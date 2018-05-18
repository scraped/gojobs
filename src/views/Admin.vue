<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-spaced">Admin panel</h1>

        <div class="columns">
          <div class="column is-one-quarter">
            <aside class="menu box">
              <ul class="menu-list">
                <li>
                  <router-link to="/admin">Jobs</router-link>
                </li>
                <li><a>Crews</a></li>
              </ul>
            </aside>
          </div>
          <div class="column">
            <div class="tabs">
              <ul>
                <router-link to="/admin/fetch" tag="li"><a>Fetch jobs</a></router-link>
              </ul>
            </div>
            <router-view></router-view>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
