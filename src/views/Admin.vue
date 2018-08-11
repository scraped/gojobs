<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-spaced">Admin panel</h1>

        <div class="columns">
          <div class="column is-one-quarter">
            <div class="box">
              <aside class="menu">
                <ul class="menu-list">
                  <li>
                    <router-link to="/admin/jobs">Jobs</router-link>
                  </li>
                  <li>
                    <router-link to="/admin/crews">Crews</router-link>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
          <div class="column">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
