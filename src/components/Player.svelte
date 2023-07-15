<script lang="ts">
    export let id: string;
</script>

<iframe
    title="user info"
    id="output-iframe"
    src="https://tetr.fires.bz/overlay/user?username={id}&display-name=true&display-level=true&display-role=true&display-badge=true&display-rank=true&display-league=true&display-sprint=true&display-blitz=true&display-standingsets=true&display-standingsets-sprint=true&display-standingsets-blitz=true&alignment=top&layout=horizontal&league=apm+pps+vs&sprint=pieces+pps+ff&blitz=pps+ff+spp"
/>

<style>
    iframe {
        width: 1000px;
        height: 200px;
        border: none;
    }
</style>
