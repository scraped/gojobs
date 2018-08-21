<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-spaced">Admin panel</h1>

        <div class="columns">
          <div class="column is-one-quarter">
            <div>
              <aside class="menu">
                <div class="menu-label">
                  Content
                </div>
                <ul class="menu-list">
                  <li>
                    <router-link to="/admin/jobs">Jobs</router-link>
                  </li>
                  <li>
                    <router-link to="/admin/crews">Crews</router-link>
                  </li>
                  <li>
                    <router-link to="/admin/Users">Users</router-link>
                  </li>
                </ul>

                <div class="menu-label">
                  External resourses
                </div>
                <ul class="menu-list">
                  <li>
                    <a href="http://localhost:4567" target="_blank">
                      Queue Server
                    </a>
                  </li>
                  <li>
                    <a href="http://localhost:8888" target="_blank">
                      Bundle Info
                      <span class="tag is-warning">Development only</span>
                    </a>
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
